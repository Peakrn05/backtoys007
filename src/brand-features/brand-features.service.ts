import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BrandFeature } from './brand-feature.entity';

@Injectable()
export class BrandFeaturesService {
  constructor(
    @InjectRepository(BrandFeature)
    private readonly brandFeatureRepo: Repository<BrandFeature>,
  ) {}

  findAll() {
    return this.brandFeatureRepo.find({ order: { displayOrder: 'ASC' } });
  }
}
