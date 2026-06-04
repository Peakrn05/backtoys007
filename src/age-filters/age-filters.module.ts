import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgeFiltersController } from './age-filters.controller';
import { AgeFiltersService } from './age-filters.service';
import { AgeFilter } from './age-filter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AgeFilter])],
  controllers: [AgeFiltersController],
  providers: [AgeFiltersService],
  exports: [AgeFiltersService],
})
export class AgeFiltersModule {}
