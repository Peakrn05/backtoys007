import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandFeaturesController } from './brand-features.controller';
import { BrandFeaturesService } from './brand-features.service';
import { BrandFeature } from './brand-feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrandFeature])],
  controllers: [BrandFeaturesController],
  providers: [BrandFeaturesService],
  exports: [BrandFeaturesService],
})
export class BrandFeaturesModule {}
