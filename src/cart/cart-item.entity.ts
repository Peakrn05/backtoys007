import {
  Entity,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('cart_items')
export class CartItem {
  @PrimaryColumn({ type: 'text', name: 'user_id' })
  userId: string;

  @PrimaryColumn({ type: 'text', name: 'product_id' })
  productId: string;

  @Column()
  quantity: number;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // New nullable columns
  @Column({ type: 'text', nullable: true, name: 'session_id' })
  sessionId: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  createdAt: Date;
}
