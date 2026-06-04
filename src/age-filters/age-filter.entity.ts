import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('age_filters')
export class AgeFilter {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  label: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ default: 0, name: 'display_order' })
  displayOrder: number;
}
