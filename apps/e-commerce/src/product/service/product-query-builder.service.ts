import { Injectable } from '@nestjs/common';
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
    if (filter.brands.length > 0) {
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
          attributes: ['id', 'name'],
          model: ECPublishStatus,
          as: 'publishStatus',
        },
      ])
      .thenInlcude({
        attributes: ['id', 'name'],
        model: ECInventoryStatus,
        as: 'inventoryStatus',
      })
      .thenInlcude({
        attributes: ['id', 'name', 'slug'],
        model: ECBrand,
        as: 'brand',
      })
      .thenInlcude({
        attributes: ['id', 'name', 'slug'],
        model: EAVEntityType,
        as: 'entityType',
      })
      .thenInlcude({
        attributes: ['id', 'fileName'],
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
        .attributes([
          'attributeId',
          [
            Sequelize.fn(
              'isnull',
              Sequelize.col('productAttributeValues.val'),
              Sequelize.col('productAttributeValues.attributeValue.value'),
            ),
            'val',
          ],
          [Sequelize.col('attributeValueId'), 'attributeValueId'],
        ])
        .include([
          {
            attributes: ['id', 'name', 'attributeTypeId'],
            model: EAVAttribute,
            as: 'attribute',
          },
          {
            attributes: ['id', 'attributeId', 'value'],
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
      .attributes([
        'id',
        'productId',
        'vendorId',
        'colorId',
        'guaranteeId',
        'guaranteeMonthId',
        'buyPrice',
        'qty',
        'onlyProvinceId',
        'vendorAddressId',
        'weight',
        'inventoryStatusId',
      ])
      .include([
        {
          attributes: ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        },
        {
          attributes: ['id', 'name', 'hexCode'],
          model: ECColor,
          as: 'color',
          required: false,
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: ECGuarantee,
          as: 'guarantee',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: ECGuaranteeMonth,
          as: 'guaranteeMonth',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'onlyProvince',
          required: false,
        },
        {
          attributes: ['price'],
          model: ECInventoryPrice,
          as: 'firstPrice',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
          ],
          where: Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('inventories.firstPrice.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        },
        {
          attributes: ['price'],
          model: ECInventoryPrice,
          as: 'secondaryPrice',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
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
        },
      ])
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

    if (filter.colors.length > 0) {
      // AND [ECI].inventoryStatusId = ${InventoryStatusEnum.available}
      const colorFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND [ECI].colorId IN(${filter.colors.join(',')}))`.replaceAll(
          /\s\s+/g,
          ' ',
        ),
      );
      queryBuilder = queryBuilder.filter(colorFiltered);
      queryResultBuilder = queryResultBuilder.filter(colorFiltered);
      inventoryIncludeBuilder = inventoryIncludeBuilder.filter({
        colorId: {
          [Op.in]: filter.colors,
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
              AND [ECI].vendorId = ${filter.vendorId})`.replaceAll(
          /\s\s+/g,
          ' ',
        ),
      );
      queryBuilder.filter(vendorFiltered);
      queryResultBuilder.filter(vendorFiltered);
      inventoryIncludeBuilder.filter({ vendorId: filter.vendorId });
    }

    queryResultBuilder = queryResultBuilder.thenInlcude(
      inventoryIncludeBuilder.build(),
    );

    const resultQueryAttributes = [
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
      .order({ orderBy: 'inventoryStatusId', sortOrder: 'ASC' })
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .order([
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
}
