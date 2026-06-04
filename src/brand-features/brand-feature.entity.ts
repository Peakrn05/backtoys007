import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('brand_features')
export class BrandFeature {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text' })
  icon: string;

  @Column({ type: 'text' })
  color: string;

  @Column({ default: 0, name: 'display_order' })
  displayOrder: number;
}
