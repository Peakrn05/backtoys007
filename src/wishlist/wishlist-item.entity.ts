import {
  Entity,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('wishlist_items')
export class WishlistItem {
  @PrimaryColumn({ type: 'text', name: 'user_id' })
  userId: string;

  @PrimaryColumn({ type: 'text', name: 'product_id' })
  productId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
