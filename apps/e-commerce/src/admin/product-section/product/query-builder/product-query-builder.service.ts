import { Injectable } from '@nestjs/common';
import {
  IncludeOptionsBuilder,
  QueryOptionsBuilder,
} from '@rahino/query-filter/sequelize-query-builder';
import { GetProductDto } from '../dto';
import { FindAndCountOptions, Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import {
  EAVAttribute,
  EAVAttributeValue,
  EAVEntityAttributeValue,
  EAVEntityPhoto,
  EAVEntityType,
  ECAddress,
  ECBrand,
  ECCity,
  ECColor,
  ECGuarantee,
  ECGuaranteeMonth,
  ECInventory,
  ECInventoryPrice,
  ECInventoryStatus,
  ECNeighborhood,
  ECProvince,
  ECPublishStatus,
  ECScheduleSendingType,
  ECVariationPrice,
  ECVendor,
  ECVendorAddress,
} from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { isNotNull } from '@rahino/commontools';

@Injectable()
export class ProductQueryBuilderService {
  constructor() {}

  async findAllAndCount(
    vendorIds: number[],
    filter: GetProductDto,
    productId?: bigint,
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
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filterIf(isNotNull(productId), {
        id: productId,
      })
      .filterIf(isNotNull(filter.brandId), {
        brandId: filter.brandId,
      })
      .filterIf(isNotNull(filter.productIds) && filter.productIds.length > 0, {
        id: {
          [Op.in]: filter.productIds,
        },
      })
      .filterIf(isNotNull(filter.entityTypeId), {
        entityTypeId: filter.entityTypeId,
      });

    const countQueryBuilder = _.cloneDeep(queryBuilder);

    const countQuery = countQueryBuilder.build();

    const inventoryQueryBuilder = new IncludeOptionsBuilder({
      attributes: [
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
        'description',
        'inventoryDescriptor',
        'scheduleSendingTypeId',
        'offsetDay',
      ],
      model: ECInventory,
      as: 'inventories',

      where: {
        [Op.and]: [
          {
            vendorId: {
              [Op.in]: vendorIds,
            },
          },
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('inventories.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        ],
      },
      include: [
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
          attributes: ['id', 'name'],
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
          attributes: ['id', 'title', 'icon'],
          model: ECScheduleSendingType,
          as: 'scheduleSendingType',
          required: false,
        },
        {
          attributes: ['id', 'vendorId', 'addressId'],
          model: ECVendorAddress,
          as: 'vendorAddress',
          required: false,
          include: [
            {
              attributes: [
                'id',
                'name',
                'latitude',
                'longitude',
                'provinceId',
                'cityId',
                'neighborhoodId',
                'street',
                'alley',
                'plaque',
                'floorNumber',
              ],
              model: ECAddress,
              as: 'address',
              required: false,
              include: [
                {
                  attributes: ['id', 'name'],
                  model: ECProvince,
                  as: 'province',
                  required: false,
                },
                {
                  attributes: ['id', 'name'],
                  model: ECCity,
                  as: 'city',
                  required: false,
                },
                {
                  attributes: ['id', 'name'],
                  model: ECNeighborhood,
                  as: 'neighborhood',
                  required: false,
                },
              ],
            },
            {
              attributes: ['id', 'name'],
              model: ECVendor,
              as: 'vendor',
              required: false,
            },
          ],
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
      ],
      required: false,
    });

    queryBuilder = queryBuilder
      .attributes([
        'id',
        'title',
        'sku',
        'description',
        'slug',
        'entityTypeId',
        'colorBased',
        'brandId',
        'publishStatusId',
        'viewCount',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'weight',
        'productFormulaId',
        'wages',
        'stoneMoney',
      ])
      .include([
        {
          attributes: ['id', 'name'],
          model: ECPublishStatus,
          as: 'publishStatus',
        },
      ])
      .thenInclude({
        attributes: ['id', 'name'],
        model: ECInventoryStatus,
        as: 'inventoryStatus',
      })
      .thenInclude({
        attributes: ['id', 'name', 'slug'],
        model: ECBrand,
        as: 'brand',
      })
      .thenInclude({
        attributes: ['id', 'name', 'slug'],
        model: EAVEntityType,
        as: 'entityType',
      })
      .thenInclude({
        attributes: ['id', 'fileName'],
        model: Attachment,
        as: 'attachments',
        required: false,
        through: { attributes: ['priority'] },
        order: [
          [{ model: EAVEntityPhoto, as: 'productPhotos' }, 'priority', 'asc'],
        ],
      })
      .thenInclude({
        attributes: ['id', 'fileName'],
        model: Attachment,
        as: 'videoAttachments',
        required: false,
        through: {
          attributes: [],
        },
      })
      .thenIncludeIf(filter.includeAttribute == true, {
        attributes: [
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
        ],
        model: EAVEntityAttributeValue,
        as: 'productAttributeValues',
        include: [
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
        ],
        required: false,
      })
      .filterIf(
        isNotNull(filter.inventoryStatusId),
        Sequelize.literal(`EXISTS (
        SELECT 1
        FROM ECInventories AS inventory
        WHERE inventory.productId = ECProduct.id
          AND inventory.inventoryStatusId = ${filter.inventoryStatusId}
          AND isnull(inventory.isDeleted, 0) = 0
          AND inventory.vendorId IN (${vendorIds.join(',')})  
      )`),
      )
      .thenInclude(inventoryQueryBuilder.build())
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .subQuery(true);

    const resultQuery = queryBuilder.build();

    return {
      countQuery: countQuery,
      resultQuery: resultQuery,
    };
  }
}
