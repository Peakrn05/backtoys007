import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { Category } from './categories/category.entity';
import { Product } from './products/product.entity';
import { Brand } from './brands/brand.entity';
import { HeroBanner } from './hero-banners/hero-banner.entity';
import { User } from './users/user.entity';
import { CustomerProfile } from './users/customer-profile.entity';
import { Order } from './orders/order.entity';
import { OrderItem } from './orders/order-item.entity';
import { CartItem } from './cart/cart-item.entity';
import { WishlistItem } from './wishlist/wishlist-item.entity';
import { AgeFilter } from './age-filters/age-filter.entity';
import { BrandFeature } from './brand-features/brand-feature.entity';

// Feature modules
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { BrandsModule } from './brands/brands.module';
import { HeroBannersModule } from './hero-banners/hero-banners.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { SeedModule } from './seed/seed.module';
import { AgeFiltersModule } from './age-filters/age-filters.module';
import { BrandFeaturesModule } from './brand-features/brand-features.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'toy_db'),
        ssl: false,
        entities: [
          Category,
          Product,
          Brand,
          HeroBanner,
          User,
          CustomerProfile,
          Order,
          OrderItem,
          CartItem,
          WishlistItem,
          AgeFilter,
          BrandFeature,
        ],
        synchronize: true,
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    ProductsModule,
    BrandsModule,
    HeroBannersModule,
    UsersModule,
    OrdersModule,
    CartModule,
    WishlistModule,
    SeedModule,
    AgeFiltersModule,
    BrandFeaturesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
