import { Controller, Get } from '@nestjs/common';
import { BrandFeaturesService } from './brand-features.service';

@Controller('brand-features')
export class BrandFeaturesController {
  constructor(private readonly brandFeaturesService: BrandFeaturesService) {}

  @Get()
  findAll() {
    return this.brandFeaturesService.findAll();
  }
}
