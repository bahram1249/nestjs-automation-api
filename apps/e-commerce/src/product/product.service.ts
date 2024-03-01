import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProductDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import * as _ from 'lodash';
import { ProductQueryBuilderService } from './service';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    private readonly productQueryBuilderService: ProductQueryBuilderService,
  ) {}

  async findBySlug(filter: GetProductDto, slug: string) {
    const { resultQuery, countQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(
        filter,
        null,
        slug,
        true,
      );

    const product = await this.repository.findOne(resultQuery);
    if (!product) {
      throw new NotFoundException('the item with this given slug not founded!');
    }
    return {
      result: product,
    };
  }

  async findById(filter: GetProductDto, productId: bigint) {
    const { resultQuery, countQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(
        filter,
        productId,
        null,
        true,
      );

    const product = await this.repository.findOne(resultQuery);
    if (!product) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: product,
    };
  }

  async findAll(filter: GetProductDto) {
    const { resultQuery, countQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(filter);

    return {
      result: await this.repository.findAll(resultQuery),
      total: await this.repository.count(countQuery), //count,
    };
  }
}
