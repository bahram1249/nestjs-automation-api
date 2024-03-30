import { Injectable, NotFoundException } from '@nestjs/common';
import { GetProductDto, GetUnPriceDto } from '../dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import * as _ from 'lodash';
import { ProductQueryBuilderService } from './product-query-builder.service';
import { ApplyDiscountService } from './apply-discount.service';
import { ApplyInventoryStatus } from './apply-inventory-status.service';
import { RemoveEmptyPriceService } from './remove-empty-price.service';
import { Sequelize } from 'sequelize';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductRepositoryService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    private readonly productQueryBuilderService: ProductQueryBuilderService,
    private readonly applyDiscountService: ApplyDiscountService,
    private readonly applyInventoryStatus: ApplyInventoryStatus,
    private readonly removeEmptyPriceService: RemoveEmptyPriceService,
    private readonly config: ConfigService,
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

  async priceRange(filter: GetUnPriceDto) {
    const defaultMax =
      this.config.get<number>('DEFAULT_MIN_PRICE_RANGE') || 10000000;
    const defaultMin = this.config.get<number>('DEFAULT_MAX_PRICE_RANGE') || 0;
    const { resultQuery, countQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(
        filter,
        null,
        null,
        null,
        true,
      );

    resultQuery.limit = null;
    resultQuery.offset = null;
    resultQuery.order = null;
    resultQuery.subQuery = false;
    resultQuery.attributes = [
      [
        Sequelize.fn(
          'isnull',
          Sequelize.fn('min', Sequelize.col('inventories.firstPrice.price')),
          defaultMin,
        ),
        'minPrice',
      ],
      [
        Sequelize.fn(
          'isnull',
          Sequelize.fn('max', Sequelize.col('inventories.firstPrice.price')),
          defaultMax,
        ),
        'maxPrice',
      ],
    ];
    resultQuery.raw = true;
    let results = await this.repository.findOne(resultQuery);
    return {
      result: results,
    };
  }
}
