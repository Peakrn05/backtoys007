import { Controller, Get } from '@nestjs/common';
import { AgeFiltersService } from './age-filters.service';

@Controller('age-filters')
export class AgeFiltersController {
  constructor(private readonly ageFiltersService: AgeFiltersService) {}

  @Get()
  findAll() {
    return this.ageFiltersService.findAll();
  }
}
