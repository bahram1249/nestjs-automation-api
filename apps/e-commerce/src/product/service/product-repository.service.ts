import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { GetProductDto, GetUnPriceDto } from '../dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/localdatabase/models';
import * as _ from 'lodash';
import { ProductQueryBuilderService } from './product-query-builder.service';
import { ApplyDiscountService } from './apply-discount.service';
import { ApplyInventoryStatus } from './apply-inventory-status.service';
import { RemoveEmptyPriceService } from './remove-empty-price.service';
import { Sequelize } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { ECSlugVersion } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { RedirectException } from '@rahino/ecommerce/util/exception';
import { SlugVersionTypeEnum } from '@rahino/ecommerce/util/enum';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class ProductRepositoryService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    @InjectModel(ECSlugVersion)
    private readonly slugVersionRepository: typeof ECSlugVersion,
    private readonly productQueryBuilderService: ProductQueryBuilderService,
    private readonly applyDiscountService: ApplyDiscountService,
    private readonly applyInventoryStatus: ApplyInventoryStatus,
    private readonly removeEmptyPriceService: RemoveEmptyPriceService,
    private listFilterFactory: ListFilterV2Factory,

    private readonly config: ConfigService,
    private readonly localizationService: LocalizationService,
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
      // if product change the slug

      const isExistsBefore = await this.slugVersionRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ slug: slug })
          .filter({ slugVersionTypeId: SlugVersionTypeEnum.Product })
          .build(),
      );
      if (isExistsBefore) {
        const oldItemQuery =
          await this.productQueryBuilderService.findAllAndCountQuery(
            await this.listFilterFactory.create(),
            isExistsBefore.entityId,
            null,
            true,
          );

        const oldItem = await this.repository.findOne(oldItemQuery.resultQuery);

        if (oldItem) {
          throw new RedirectException(
            `/product/${oldItem.sku}/${oldItem.slug}`,
          );
        }
      }

      // if product deleted before
      const productFoundAsDeleted = await this.repository.findOne(
        new QueryOptionsBuilder().filter({ slug: slug }).build(),
      );
      if (productFoundAsDeleted) {
        throw new GoneException('item is deleted');
      }
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_slug'),
      );
    }

    product = await this.removeEmptyPriceService.applyProduct(product);
    product = await this.applyInventoryStatus.applyProduct(product);
    return {
      result: await this.applyDiscountService.applyProduct(product),
    };
  }

  async findById(
    filter: GetProductDto,
    productId: bigint,
    includeAttribute?: boolean,
  ) {
    const { resultQuery, countQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(
        filter,
        productId,
        null,
        includeAttribute || true,
      );

    let product = await this.repository.findOne(resultQuery);
    if (!product) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
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

  async findAllAndCount(filter: GetProductDto) {
    const { resultQuery, countQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(filter);

    const { rows, count } = await this.repository.findAndCountAll(resultQuery);
    let results = rows;
    results = await this.removeEmptyPriceService.applyProducts(results);
    results = await this.applyInventoryStatus.applyProducts(results);
    results = await this.applyDiscountService.applyProducts(results);
    return {
      result: results,
      total: count, //count,
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
