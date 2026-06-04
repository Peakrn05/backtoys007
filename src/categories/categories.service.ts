import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Product } from '../products/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  findAll() {
    return this.categoryRepo.find({ order: { id: 'ASC' } });
  }

  async findProductsBySlug(slug: string) {
    const category = await this.categoryRepo.findOne({ where: { slug } });
    if (!category) return [];
    return this.productRepo.find({
      where: { categoryId: category.id },
      order: { createdAt: 'DESC' },
    });
  }
}
