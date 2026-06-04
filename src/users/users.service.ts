import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CustomerProfile } from './customer-profile.entity';
import { Order } from '../orders/order.entity';
import { WishlistItem } from '../wishlist/wishlist-item.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(CustomerProfile)
    private readonly profileRepo: Repository<CustomerProfile>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(WishlistItem)
    private readonly wishlistRepo: Repository<WishlistItem>,
  ) {}

  async findMe(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    const profile = await this.profileRepo.findOne({ where: { userId } });
    return { ...user, profile: profile || null };
  }

  async updateMe(userId: string, dto: Partial<User & CustomerProfile>) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Update user fields
    const { phone, avatarUrl, memberSince, loyaltyPoints, address, tier, ...userFields } = dto as any;
    Object.assign(user, userFields);
    await this.userRepo.save(user);

    // Update profile fields
    const profileUpdate: any = {};
    if (phone !== undefined) profileUpdate.phone = phone;
    if (avatarUrl !== undefined) profileUpdate.avatarUrl = avatarUrl;
    if (memberSince !== undefined) profileUpdate.memberSince = memberSince;
    if (loyaltyPoints !== undefined) profileUpdate.loyaltyPoints = loyaltyPoints;
    if (address !== undefined) profileUpdate.address = address;
    if (tier !== undefined) profileUpdate.tier = tier;

    if (Object.keys(profileUpdate).length > 0) {
      await this.profileRepo.upsert({ userId, ...profileUpdate }, ['userId']);
    }

    return this.findMe(userId);
  }

  async getOrders(userId: string) {
    return this.orderRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getWishlist(userId: string) {
    return this.wishlistRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
