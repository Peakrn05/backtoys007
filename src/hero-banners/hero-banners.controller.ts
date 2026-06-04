import { Controller, Get } from '@nestjs/common';
import { HeroBannersService } from './hero-banners.service';

@Controller('hero-banners')
export class HeroBannersController {
  constructor(private readonly heroBannersService: HeroBannersService) {}

  @Get()
  findAll() {
    return this.heroBannersService.findAll();
  }
}
