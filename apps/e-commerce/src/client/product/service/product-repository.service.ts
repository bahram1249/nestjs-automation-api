import { GoneException, NotFoundException } from '@nestjs/common';
import { GetProductDto, GetProductLatLonDto, GetUnPriceDto } from '../dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECProduct, ECVendor } from '@rahino/localdatabase/models';
import * as _ from 'lodash';
import { ProductQueryBuilderService } from './product-query-builder.service';
import { ApplyDiscountService } from '../../../shared/apply-discount/apply-discount.service';
import { ApplyInventoryStatus } from './apply-inventory-status.service';
import { RemoveEmptyPriceService } from './remove-empty-price.service';
import { Op, Sequelize } from 'sequelize';
import { ConfigService } from '@nestjs/config';
import { ECSlugVersion } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { RedirectException } from '@rahino/ecommerce/shared/exception';
import { SlugVersionTypeEnum } from '@rahino/ecommerce/shared/enum';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { LocalizationService } from 'apps/main/src/common/localization';

export class ProductRepositoryService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    @InjectModel(ECSlugVersion)
    private readonly slugVersionRepository: typeof ECSlugVersion,
    @InjectModel(ECVendor)
    private readonly vendorRepository: typeof ECVendor,
    private readonly productQueryBuilderService: ProductQueryBuilderService,
    private readonly applyDiscountService: ApplyDiscountService,
    private readonly applyInventoryStatus: ApplyInventoryStatus,
    private readonly removeEmptyPriceService: RemoveEmptyPriceService,
    private listFilterFactory: ListFilterV2Factory,

    private readonly config: ConfigService,
    private readonly localizationService: LocalizationService,
  ) {}

  async findBySlug(filter: GetProductDto, slug: string) {
    const { resultQuery } =
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
    const { resultQuery: resultQuery } =
      await this.productQueryBuilderService.findAllAndCountQuery(
        filter,
        productId,
        null,
        includeAttribute ?? true,
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

  async findAllWithLatLon(filter: GetProductLatLonDto) {
    const nearbyVendors = await this.getNearbyVendors(filter);

    filter.vendorIds = nearbyVendors;

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
    const { resultQuery } =
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
    const { resultQuery } =
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
    const results = await this.repository.findOne(resultQuery);
    return {
      result: results,
    };
  }

  private async getNearbyVendors(filter: GetProductLatLonDto) {
    const replacements = {
      longitude: Number(filter.longitude),
      latitude: Number(filter.latitude),
    };

    const queryBuilder = new QueryOptionsBuilder()
      .attributes(['id'])
      .filter({
        coordinates: {
          [Op.not]: null,
        },
      })

      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .order([
        Sequelize.literal(
          `coordinates.STDistance(geography::Point(:latitude, :longitude, 4326))`,
        ),
        'ASC',
      ])
      .limit(10)
      .offset(0)
      .replacements(replacements);

    const result = await this.vendorRepository.findAll(queryBuilder.build());

    return result.map((v) => v.id);
  }
}
