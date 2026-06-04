import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('customer_profiles')
export class CustomerProfile {
  @PrimaryColumn({ type: 'text', name: 'user_id' })
  userId: string;

  @Column({ type: 'text', nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true, name: 'avatar_url' })
  avatarUrl: string;

  @Column({ type: 'date', nullable: true, name: 'member_since' })
  memberSince: Date;

  @Column({ default: 0, name: 'loyalty_points' })
  loyaltyPoints: number;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  tier: string;
}
