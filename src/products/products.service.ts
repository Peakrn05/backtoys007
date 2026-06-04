import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll(query: {
    category?: string;
    ageGroup?: string;
    badge?: string;
    search?: string;
    inStock?: string;
  }) {
    const qb = this.productRepo.createQueryBuilder('p');

    if (query.category) {
      qb.andWhere('p.categoryId = :category', { category: query.category });
    }
    if (query.ageGroup) {
      qb.andWhere('p.ageGroup = :ageGroup', { ageGroup: query.ageGroup });
    }
    if (query.badge) {
      qb.andWhere('p.badge = :badge', { badge: query.badge });
    }
    if (query.inStock !== undefined) {
      qb.andWhere('p.inStock = :inStock', {
        inStock: query.inStock === 'true',
      });
    }
    if (query.search) {
      qb.andWhere('p.name ILIKE :search', { search: `%${query.search}%` });
    }

    return qb.getMany();
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
}
