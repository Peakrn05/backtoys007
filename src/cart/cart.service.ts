import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepo: Repository<CartItem>,
  ) {}

  async getCart(userId?: string) {
    if (!userId) return [];
    return this.cartRepo.find({ where: { userId } });
  }

  async addItem(dto: {
    productId: string;
    quantity: number;
    userId: string;
  }) {
    const existing = await this.cartRepo.findOne({
      where: { userId: dto.userId, productId: dto.productId },
    });

    if (existing) {
      existing.quantity += dto.quantity;
      return this.cartRepo.save(existing);
    }

    const item = this.cartRepo.create({
      userId: dto.userId,
      productId: dto.productId,
      quantity: dto.quantity,
    });
    return this.cartRepo.save(item);
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    if (quantity <= 0) {
      await this.cartRepo.delete({ userId, productId });
      return { deleted: true };
    }
    const item = await this.cartRepo.findOne({ where: { userId, productId } });
    if (!item) return { notFound: true };
    item.quantity = quantity;
    return this.cartRepo.save(item);
  }

  async removeItem(userId: string, productId: string) {
    await this.cartRepo.delete({ userId, productId });
    return { deleted: true };
  }

  async clearCart(userId: string) {
    if (!userId) return { deleted: 0 };
    const result = await this.cartRepo.delete({ userId });
    return { deleted: result.affected };
  }
}
