import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text' })
  label: string;

  @Column({ type: 'text', unique: true })
  slug: string;

  @Column({ type: 'text' })
  icon: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
