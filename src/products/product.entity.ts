import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, nullable: true, name: 'original_price' })
  originalPrice: number;

  @Column({ type: 'text', name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'text', name: 'category_id' })
  categoryId: string;

  @Column({ type: 'text', nullable: true })
  badge: string;

  @Column({ type: 'numeric', precision: 3, scale: 2 })
  rating: number;

  @Column({ default: 0, name: 'review_count' })
  reviewCount: number;

  @Column({ default: true, name: 'in_stock' })
  inStock: boolean;

  @Column({ type: 'text', name: 'age_group' })
  ageGroup: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
