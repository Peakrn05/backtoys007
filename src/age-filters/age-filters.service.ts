import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgeFilter } from './age-filter.entity';

@Injectable()
export class AgeFiltersService {
  constructor(
    @InjectRepository(AgeFilter)
    private readonly ageFilterRepo: Repository<AgeFilter>,
  ) {}

  findAll() {
    return this.ageFilterRepo.find({ order: { displayOrder: 'ASC' } });
  }
}
