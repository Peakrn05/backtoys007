import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text', nullable: true, name: 'user_id' })
  userId: string;

  @Column({ type: 'date', name: 'order_date' })
  orderDate: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'text' })
  status: string;

  @Column({ type: 'text', nullable: true, name: 'status_color_class' })
  statusColorClass: string;

  // New nullable columns for app logic
  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  subtotal: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, name: 'shipping_fee' })
  shippingFee: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true })
  tax: number;

  @Column({ type: 'text', nullable: true, name: 'payment_method' })
  paymentMethod: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;
}
