import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepo: Repository<WishlistItem>,
  ) {}

  findByUser(userId: string) {
    return this.wishlistRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async toggle(dto: { userId: string; productId: string }) {
    const existing = await this.wishlistRepo.findOne({
      where: { userId: dto.userId, productId: dto.productId },
    });

    if (existing) {
      await this.wishlistRepo.delete({ userId: dto.userId, productId: dto.productId });
      return { added: false, productId: dto.productId };
    }

    const item = this.wishlistRepo.create({
      userId: dto.userId,
      productId: dto.productId,
    });
    await this.wishlistRepo.save(item);
    return { added: true, productId: dto.productId };
  }
}
