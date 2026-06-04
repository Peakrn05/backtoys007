import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  findAll(userId: string) {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    const items = await this.orderItemRepo.find({ where: { orderId: id } });
    return { ...order, orderItems: items };
  }

  async create(
    userId: string,
    dto: {
      items: { productId: string; quantity: number }[];
      paymentMethod?: string;
    },
  ) {
    const TAX_RATE = 0.07;
    const FREE_SHIPPING_THRESHOLD = 50;
    const SHIPPING_FEE = 5.99;

    let subtotal = 0;
    const itemsToSave: Omit<OrderItem, 'createdAt'>[] = [];

    for (const item of dto.items) {
      const product = await this.productRepo.findOne({
        where: { id: item.productId },
      });
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      const unitPrice = Number(product.price);
      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      itemsToSave.push({
        id: `oi-${Date.now()}-${item.productId}`,
        orderId: '',
        productId: item.productId,
        productName: product.name,
        productImage: product.imageUrl,
        unitPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      } as any);
    }

    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const total = parseFloat((subtotal + shippingFee + tax).toFixed(2));
    const orderId = `WOT-${Date.now()}`;

    const order = this.orderRepo.create({
      id: orderId,
      userId,
      orderDate: new Date(),
      subtotal,
      shippingFee,
      tax,
      total,
      status: 'pending',
      paymentMethod: dto.paymentMethod,
    });

    const savedOrder = await this.orderRepo.save(order);

    for (const item of itemsToSave) {
      item.orderId = savedOrder.id;
      await this.orderItemRepo.save(item as any);
    }

    const items = await this.orderItemRepo.find({ where: { orderId: savedOrder.id } });
    return { ...savedOrder, orderItems: items };
  }
}
