import { Injectable } from '@nestjs/common';
import { GetProductDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { ECPublishStatus } from '@rahino/database/models/ecommerce-eav/ec-publish-status.entity';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';
import { ECBrand } from '@rahino/database/models/ecommerce-eav/ec-brand.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { EAVEntityAttributeValue } from '@rahino/database/models/eav/eav-entity-attribute-value.entity';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVAttributeValue } from '@rahino/database/models/eav/eav-attribute-value';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { PublishStatusEnum } from './enum';
import { InventoryStatusEnum } from '../inventory/enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
  ) {}
  async findBySlug(slug: string) {
    throw new Error('Method not implemented.');
  }
  async findAll(filter: GetProductDto) {
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

    if (filter.colors.length > 0) {
      queryBuilder = queryBuilder.filter(
        Sequelize.literal(`EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            WHERE [ECProduct].id = [ECI].productId
              AND [ECI].inventoryStatusId = ${PublishStatusEnum.publish}
              AND [ECI].colorId IN(${filter.colors.join(',')}))`),
      );
    }

    const productCount = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes([
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
      ])
      .include([
        {
          attributes: ['id', 'name'],
          model: ECPublishStatus,
          as: 'publishStatus',
        },
        {
          attributes: ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: ECBrand,
          as: 'brand',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'entityType',
        },
        {
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
            //'description',
          ],
          model: ECInventory,
          as: 'inventories',
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('inventories.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
              {
                inventoryStatusId: InventoryStatusEnum.available,
              },
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
          ],
          required: false,
        },
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachments',
          required: false,
        },
      ])
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
      result: await this.repository.findAll(queryBuilder.build()),
      total: productCount, //count,
    };
  }
}
