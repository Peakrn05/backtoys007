import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('category') category?: string,
    @Query('ageGroup') ageGroup?: string,
    @Query('badge') badge?: string,
    @Query('search') search?: string,
    @Query('inStock') inStock?: string,
  ) {
    const tresult =  this.productsService.findAll({
      category,
      ageGroup,
      badge,
      search,
      inStock,
    })
    console.log("tresult", await tresult)
    return tresult;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }
}
