import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'text' })
  id: string;

  @Column({ type: 'text', name: 'first_name' })
  firstName: string;

  @Column({ type: 'text', name: 'last_name' })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  provider: string;

  @Column({ default: false, name: 'is_guest' })
  isGuest: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // New nullable columns (added to existing table)
  @Column({ type: 'text', nullable: true, name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ type: 'text', nullable: true, name: 'provider_id' })
  providerId: string;
}
