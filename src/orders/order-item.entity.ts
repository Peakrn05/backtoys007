import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('order_items')
export class OrderItem {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text', name: 'order_id' })
  orderId: string;

  @Column({ type: 'text', nullable: true, name: 'product_id' })
  productId: string;

  @Column({ type: 'text', name: 'product_name' })
  productName: string;

  @Column()
  quantity: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, name: 'unit_price' })
  unitPrice: number;

  // New nullable columns
  @Column({ type: 'text', nullable: true, name: 'product_image' })
  productImage: string;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  subtotal: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;
}
