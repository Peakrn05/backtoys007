import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroBannersController } from './hero-banners.controller';
import { HeroBannersService } from './hero-banners.service';
import { HeroBanner } from './hero-banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HeroBanner])],
  controllers: [HeroBannersController],
  providers: [HeroBannersService],
  exports: [HeroBannersService],
})
export class HeroBannersModule {}
