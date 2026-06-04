import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HeroBanner } from './hero-banner.entity';

@Injectable()
export class HeroBannersService {
  constructor(
    @InjectRepository(HeroBanner)
    private readonly heroBannerRepo: Repository<HeroBanner>,
  ) {}

  findAll() {
    return this.heroBannerRepo.find({ order: { displayOrder: 'ASC' } });
  }
}
