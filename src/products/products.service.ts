import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) { }

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
    if (query.inStock) {
      qb.andWhere('p.inStock = :inStock', {
        inStock: query.inStock === 'true',
      });
    }
    if (query.search) {
      qb.andWhere('p.name ILIKE :search', { search: `%${query.search}%` });
    }
    const result = await qb.getMany()
    console.log("Query", this.getFullQuery(qb))
    const edit = result.map(row => ({ ...row, pricetag: row.name + " -- " + row.price }))
    console.log("edit", edit)
    return edit;
  }

  private getFullQuery(qb: SelectQueryBuilder<any>): string {
    let sql = qb.getSql();
    const params = qb.getParameters();

    // สำคัญ: TypeORM ใช้ $1, $2, $3...
    Object.keys(params).forEach((key, index) => {
      const paramKey = `$${index + 1}`;           // $1, $2, $3 ...
      let value = params[key];

      if (value === null || value === undefined) {
        value = 'NULL';
      } else if (typeof value === 'string') {
        value = `'${value.replace(/'/g, "''")}'`;   // escape single quote
      } else if (value instanceof Date) {
        value = `'${value.toISOString()}'`;
      } else if (Array.isArray(value)) {
        value = `(${value.map(v => `'${v}'`).join(', ')})`;
      } else {
        value = String(value);
      }

      sql = sql.replace(new RegExp(`\\$${index + 1}\\b`, 'g'), value as string);
    });

    return sql;
  }

  async findOne(id: string) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Product ${id} not found`);
    return product;
  }
}
