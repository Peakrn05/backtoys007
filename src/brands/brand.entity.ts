import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('brands')
export class Brand {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true, name: 'category_id' })
  categoryId: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 0, name: 'product_count' })
  productCount: number;

  @Column({ type: 'text', name: 'color_class' })
  colorClass: string;

  @Column({ type: 'text', name: 'tag_color_class' })
  tagColorClass: string;

  @Column({ default: 0, name: 'display_order' })
  displayOrder: number;
}
