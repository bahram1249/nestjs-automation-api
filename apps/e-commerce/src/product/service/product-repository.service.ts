import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProductDto } from '../dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import * as _ from 'lodash';
import { ProductQueryBuilderService } from './product-query-builder.service';
import { ApplyDiscountService } from './apply-discount.service';
import { ApplyInventoryStatus } from './apply-inventory-status.service';
import { RemoveEmptyPriceService } from './remove-empty-price.service';

@Injectable()
export class ProductRepositoryService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    private readonly productQueryBuilderService: ProductQueryBuilderService,
    private readonly applyDiscountService: ApplyDiscountService,
    private readonly applyInventoryStatus: ApplyInventoryStatus,
    private readonly removeEmptyPriceService: RemoveEmptyPriceService,
  ) {}

  async findBySlug(filter: GetProductDto, slug: string) {
    const { resultQuery, countQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(
        filter,
        null,
        slug,
        true,
      );

    let product = await this.repository.findOne(resultQuery);
    if (!product) {
      throw new NotFoundException('the item with this given slug not founded!');
    }
    product = await this.removeEmptyPriceService.applyProduct(product);
    product = await this.applyInventoryStatus.applyProduct(product);
    return {
      result: await this.applyDiscountService.applyProduct(product),
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

    let product = await this.repository.findOne(resultQuery);
    if (!product) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    product = await this.removeEmptyPriceService.applyProduct(product);
    product = await this.applyInventoryStatus.applyProduct(product);
    return {
      result: await this.applyDiscountService.applyProduct(product),
    };
  }

  async findAll(filter: GetProductDto) {
    const { resultQuery, countQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(filter);

    let results = await this.repository.findAll(resultQuery);
    results = await this.removeEmptyPriceService.applyProducts(results);
    results = await this.applyInventoryStatus.applyProducts(results);
    results = await this.applyDiscountService.applyProducts(results);
    return {
      result: results,
      total: await this.repository.count(countQuery), //count,
    };
  }
}
