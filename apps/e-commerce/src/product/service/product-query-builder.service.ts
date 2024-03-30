import { BadRequestException, Injectable } from '@nestjs/common';
import { FindAndCountOptions, Op, Sequelize } from 'sequelize';
import { GetProductDto } from '../dto';
import { PublishStatusEnum } from '../enum';
import {
  IncludeOptionsBuilder,
  QueryOptionsBuilder,
} from '@rahino/query-filter/sequelize-query-builder';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { ECBrand } from '@rahino/database/models/ecommerce-eav/ec-brand.entity';
import { ECPublishStatus } from '@rahino/database/models/ecommerce-eav/ec-publish-status.entity';

import * as _ from 'lodash';
import { EAVEntityAttributeValue } from '@rahino/database/models/eav/eav-entity-attribute-value.entity';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVAttributeValue } from '@rahino/database/models/eav/eav-attribute-value';

@Injectable()
export class ProductQueryBuilderService {
  async findAllAndCountQuery(
    filter: GetProductDto,
    productId?: bigint,
    slug?: string,
    includeAttributes?: boolean,
    priceRangeQuery?: boolean,
  ): Promise<{
    resultQuery: FindAndCountOptions<any>;
    countQuery: FindAndCountOptions<any>;
  }> {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECProduct.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ publishStatusId: PublishStatusEnum.publish });
    // .filter({ inventoryStatusId: InventoryStatusEnum.available });

    if (slug) {
      queryBuilder = queryBuilder.filter({ slug: slug });
    }
    if (productId) {
      queryBuilder = queryBuilder.filter({ id: productId });
    }
    if (filter.entityTypeId) {
      queryBuilder = queryBuilder.filter({ entityTypeId: filter.entityTypeId });
    }
    if (filter.brands != null && filter.brands.length > 0) {
      queryBuilder = queryBuilder.filter({
        brandId: {
          [Op.in]: filter.brands,
        },
      });
    }

    // copy query builder
    let queryResultBuilder = _.cloneDeep(queryBuilder);
    queryResultBuilder = queryResultBuilder
      .include([
        {
          attributes: priceRangeQuery ? [] : ['id', 'name'],
          model: ECPublishStatus,
          as: 'publishStatus',
        },
      ])
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'name'],
        model: ECInventoryStatus,
        as: 'inventoryStatus',
      })
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'name', 'slug'],
        model: ECBrand,
        as: 'brand',
      })
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'name', 'slug'],
        model: EAVEntityType,
        as: 'entityType',
      })
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'fileName'],
        through: {
          attributes: [],
        },
        model: Attachment,
        as: 'attachments',
        required: false,
      });

    if (includeAttributes) {
      let attributeIncludeBuilder = new IncludeOptionsBuilder({
        model: EAVEntityAttributeValue,
        as: 'productAttributeValues',
        required: false,
      });
      attributeIncludeBuilder = attributeIncludeBuilder
        .attributes(
          priceRangeQuery
            ? []
            : [
                'attributeId',
                [
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('productAttributeValues.val'),
                    Sequelize.col(
                      'productAttributeValues.attributeValue.value',
                    ),
                  ),
                  'val',
                ],
                [Sequelize.col('attributeValueId'), 'attributeValueId'],
              ],
        )
        .include([
          {
            attributes: priceRangeQuery
              ? []
              : ['id', 'name', 'attributeTypeId'],
            model: EAVAttribute,
            as: 'attribute',
          },
          {
            attributes: priceRangeQuery ? [] : ['id', 'attributeId', 'value'],
            model: EAVAttributeValue,
            as: 'attributeValue',
          },
        ]);
      queryResultBuilder.thenInlcude(attributeIncludeBuilder.build());
    }
    let inventoryIncludeBuilder = new IncludeOptionsBuilder({
      model: ECInventory,
      as: 'inventories',
      required: false,
    });
    inventoryIncludeBuilder = inventoryIncludeBuilder
      .attributes(
        priceRangeQuery
          ? []
          : [
              'id',
              'productId',
              'vendorId',
              'colorId',
              'guaranteeId',
              'guaranteeMonthId',
              'qty',
              'onlyProvinceId',
              'vendorAddressId',
              'weight',
              'inventoryStatusId',
            ],
      )
      .include([
        {
          attributes: priceRangeQuery ? [] : ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
          required: false,
        },
      ])
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'name'],
        model: ECVendor,
        as: 'vendor',
        required: false,
      })
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'name', 'hexCode'],
        model: ECColor,
        as: 'color',
        required: false,
      })
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'name', 'slug'],
        model: ECGuarantee,
        as: 'guarantee',
        required: false,
      })
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'name'],
        model: ECGuaranteeMonth,
        as: 'guaranteeMonth',
        required: false,
      })
      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['id', 'name'],
        model: ECProvince,
        as: 'onlyProvince',
        required: false,
      })

      .thenInlcude({
        attributes: priceRangeQuery ? [] : ['price'],
        model: ECInventoryPrice,
        as: 'secondaryPrice',
        required: false,
        include: [
          {
            attributes: priceRangeQuery ? [] : ['id', 'name'],
            model: ECVariationPrice,
            as: 'variationPrice',
          },
        ],
        where: Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('inventories.secondaryPrice.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('inventories.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({
        inventoryStatusId: InventoryStatusEnum.available,
      });

    // conditions
    let firstPriceIncludeBuilder = new IncludeOptionsBuilder({
      model: ECInventoryPrice,
      as: 'firstPrice',
      required: false,
    })
      .attributes(priceRangeQuery ? [] : ['price'])
      .include([
        {
          attributes: priceRangeQuery ? [] : ['id', 'name'],
          model: ECVariationPrice,
          as: 'variationPrice',
        },
      ])
      .filter({
        isDeleted: {
          [Op.is]: null,
        },
      });

    if (filter.inventoryId) {
      inventoryIncludeBuilder.filter({ id: filter.inventoryId });
    }

    if (filter.colors != null && filter.colors.length > 0) {
      // AND [ECI].inventoryStatusId = ${InventoryStatusEnum.available}
      const colorFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND [ECI].colorId IN(
                ${filter.colors.join(',')})
              )`.replaceAll(/\s\s+/g, ' '),
      );
      queryBuilder = queryBuilder.filter(colorFiltered);
      queryResultBuilder = queryResultBuilder.filter(colorFiltered);
      inventoryIncludeBuilder = inventoryIncludeBuilder.filter({
        colorId: {
          [Op.in]: filter.colors,
        },
      });
    }

    if (filter.minPrice != null) {
      const minPriceFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            LEFT JOIN ECInventoryPrices ECIP
            ON ECI.id = ECIP.inventoryId
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND ISNULL([ECIP].isDeleted, 0) = 0
              AND ECIP.variationPriceId = 1
              AND ECIP.price >= ${filter.minPrice}
            )`.replaceAll(/\s\s+/g, ' '),
      );
      queryBuilder = queryBuilder.filter(minPriceFiltered);
      queryResultBuilder = queryResultBuilder.filter(minPriceFiltered);
      firstPriceIncludeBuilder = firstPriceIncludeBuilder.filter({
        price: {
          [Op.gte]: filter.minPrice,
        },
      });
    }

    if (filter.maxPrice != null) {
      const maxPriceFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            LEFT JOIN ECInventoryPrices ECIP
            ON ECI.id = ECIP.inventoryId
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND ISNULL([ECIP].isDeleted, 0) = 0
              AND ECIP.variationPriceId = 1
              AND ECIP.price <= ${filter.maxPrice}
            )`.replaceAll(/\s\s+/g, ' '),
      );
      queryBuilder = queryBuilder.filter(maxPriceFiltered);
      queryResultBuilder = queryResultBuilder.filter(maxPriceFiltered);
      firstPriceIncludeBuilder = firstPriceIncludeBuilder.filter({
        price: {
          [Op.lte]: filter.maxPrice,
        },
      });
    }

    if (filter.vendorId) {
      // AND [ECI].inventoryStatusId = ${InventoryStatusEnum.available}
      const vendorFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND [ECI].vendorId = ${filter.vendorId}
          )`.replaceAll(/\s\s+/g, ' '),
      );
      queryBuilder.filter(vendorFiltered);
      queryResultBuilder.filter(vendorFiltered);
      inventoryIncludeBuilder.filter({ vendorId: filter.vendorId });
    }

    if (filter.attributes != null && filter.attributes.length > 0) {
      for (let index = 0; index < filter.attributes.length; index++) {
        const attribute = filter.attributes[index];
        const attributeFilter = Sequelize.literal(
          `EXISTS (
            SELECT 1
            FROM EAVEntityAttributeValues AS EEAV
            WHERE [ECProduct].id = [EEAV].entityId
              AND [EEAV].attributeId = ${attribute.attributeId}
              AND [EEAV].attributeValueId IN (
                ${attribute.attributeValues.join(',')})
            )`.replaceAll(/\s\s+/g, ' '),
        );
        queryBuilder.filter(attributeFilter);
        queryResultBuilder.filter(attributeFilter);
      }
    }

    // add first price
    inventoryIncludeBuilder = inventoryIncludeBuilder.thenInlcude(
      firstPriceIncludeBuilder.build(),
    );

    queryResultBuilder = queryResultBuilder.thenInlcude(
      inventoryIncludeBuilder.build(),
    );

    const resultQueryAttributes = priceRangeQuery
      ? []
      : [
          'id',
          'title',
          'sku',
          // 'description',
          'slug',
          'entityTypeId',
          'colorBased',
          'brandId',
          'inventoryStatusId',
          'publishStatusId',
          'viewCount',
        ];
    if (productId || slug) {
      resultQueryAttributes.push('description');
    }
    queryResultBuilder = queryResultBuilder
      .attributes(resultQueryAttributes)
      .subQuery(true)
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: 'inventoryStatusId', sortOrder: 'ASC' });
    queryBuilder = await this.parseOrder(filter, queryBuilder);
    queryBuilder = queryBuilder.order([
      { model: ECInventory, as: 'inventories' },
      { model: ECVendor, as: 'vendor' },
      'priorityOrder',
      'asc',
    ]);

    return {
      resultQuery: queryResultBuilder.build(),
      countQuery: queryBuilder.build(),
    };
  }

  async parseOrder(filter: GetProductDto, queryBuilder: QueryOptionsBuilder) {
    if (filter.orderBy.startsWith('$')) {
      const items = filter.orderBy.replaceAll('$', '').split('.');
      const orders = [];
      for (let index = 0; index < items.length; index++) {
        const order = items[index];
        if (index == items.length - 1) {
          orders.push(...[order, filter.sortOrder]);
        } else {
          switch (order) {
            case 'vendor':
              orders.push({ model: ECVendor, as: order });
              break;
            case 'inventories':
              orders.push({ model: ECInventory, as: order });
              break;
            case 'firstPrice':
              orders.push({ model: ECVariationPrice, as: order });
              break;
            case 'secondarayPrice':
              orders.push({ model: ECVariationPrice, as: order });
              break;
            default:
              throw new BadRequestException('the given format is not valid');
          }
        }
      }
    } else {
      queryBuilder = queryBuilder.order({
        orderBy: filter.orderBy,
        sortOrder: filter.sortOrder,
      });
    }
    return queryBuilder;
  }
}
