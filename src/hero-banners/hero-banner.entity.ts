import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('hero_banners')
export class HeroBanner {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  subtitle: string;

  @Column({ type: 'text' })
  cta: string;

  @Column({ type: 'text', name: 'cta_link' })
  ctaLink: string;

  @Column({ type: 'text' })
  gradient: string;

  @Column({ type: 'text', name: 'image_url' })
  imageUrl: string;

  @Column({ default: 0, name: 'display_order' })
  displayOrder: number;
}
