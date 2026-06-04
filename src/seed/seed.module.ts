import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Category } from '../categories/category.entity';
import { Product } from '../products/product.entity';
import { Brand } from '../brands/brand.entity';
import { HeroBanner } from '../hero-banners/hero-banner.entity';
import { User } from '../users/user.entity';
import { CustomerProfile } from '../users/customer-profile.entity';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
import { AgeFilter } from '../age-filters/age-filter.entity';
import { BrandFeature } from '../brand-features/brand-feature.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Category,
      Product,
      Brand,
      HeroBanner,
      User,
      CustomerProfile,
      Order,
      OrderItem,
      AgeFilter,
      BrandFeature,
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
