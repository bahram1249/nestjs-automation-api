import { BadRequestException, Injectable } from '@nestjs/common';
import {
  EAVAttribute,
  EAVAttributeValue,
  EAVEntityAttributeValue,
  EAVEntityType,
  ECBrand,
  ECColor,
  ECGuarantee,
  ECGuaranteeMonth,
  ECInventory,
  ECInventoryPrice,
  ECInventoryStatus,
  ECProvince,
  ECPublishStatus,
  ECScheduleSendingType,
  ECVariationPrice,
  ECVendor,
} from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import {
  IncludeOptionsBuilder,
  QueryOptionsBuilder,
} from '@rahino/query-filter/sequelize-query-builder';
import {
  FindAndCountOptions,
  Model,
  ModelStatic,
  Op,
  OrderItem,
  QueryTypes,
  Sequelize,
} from 'sequelize';
import { GetProductDto } from '../dto';
import { PublishStatusEnum } from '../enum';

import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { isNotNull } from '@rahino/commontools';

@Injectable()
export class ProductQueryBuilderService {
  constructor(
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}
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
      .filter({ publishStatusId: PublishStatusEnum.publish })
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      });
    // .filter({ inventoryStatusId: InventoryStatusEnum.available });

    if (filter.inventoryStatusId) {
      queryBuilder = queryBuilder.filter({
        inventoryStatusId: filter.inventoryStatusId,
      });
    }

    if (slug) {
      queryBuilder = queryBuilder.filter({ slug: slug });
    }
    if (productId) {
      queryBuilder = queryBuilder.filter({ id: productId });
    }
    if (isNotNull(filter.productIds) && filter.productIds.length > 0) {
      queryBuilder = queryBuilder.filter({
        id: {
          [Op.in]: filter.productIds,
        },
      });
    }
    if (filter.entityTypeId) {
      const entityTypeIds = [filter.entityTypeId];
      const entityType = await this.entityTypeRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: filter.entityTypeId })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('EAVEntityType.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .include([
            {
              attributes: ['id', 'name', 'slug'],
              model: EAVEntityType,
              as: 'subEntityTypes',
              required: false,
              include: [
                {
                  attributes: ['id', 'name', 'slug'],
                  model: EAVEntityType,
                  as: 'subEntityTypes',
                  required: false,
                },
              ],
            },
          ])
          .build(),
      );
      if (entityType) {
        for (let index = 0; index < entityType.subEntityTypes.length; index++) {
          const firstChild = entityType.subEntityTypes[index];
          entityTypeIds.push(firstChild.id);
          for (
            let index = 0;
            index < firstChild.subEntityTypes.length;
            index++
          ) {
            const secondaryChild = firstChild.subEntityTypes[index];
            entityTypeIds.push(secondaryChild.id);
          }
        }
      }
      queryBuilder = queryBuilder.filter({
        entityTypeId: {
          [Op.in]: entityTypeIds,
        },
      });
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
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'name'],
        model: ECInventoryStatus,
        as: 'inventoryStatus',
      })
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'name', 'slug'],
        model: ECBrand,
        as: 'brand',
      })
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'name', 'slug'],
        model: EAVEntityType,
        as: 'entityType',
      });

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
              'discountTypeId',
              'discountStartDate',
              'discountEndDate',
              'inventoryDescriptor',
              'offsetDay',
              'scheduleSendingTypeId',
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
      .thenInclude({
        attributes: priceRangeQuery
          ? []
          : ['id', 'name', 'slug', 'priorityOrder'],
        model: ECVendor,
        as: 'vendor',
        required: false,
      })

      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'name', 'hexCode'],
        model: ECColor,
        as: 'color',
        required: false,
      })
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'name', 'slug'],
        model: ECGuarantee,
        as: 'guarantee',
        required: false,
      })
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'name'],
        model: ECGuaranteeMonth,
        as: 'guaranteeMonth',
        required: false,
      })
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'name'],
        model: ECProvince,
        as: 'onlyProvince',
        required: false,
      })
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'title', 'icon'],
        model: ECScheduleSendingType,
        as: 'scheduleSendingType',
        required: false,
      })
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'price'],
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
      })
      .filter(
        Sequelize.literal(`
        EXISTS (
          SELECT 1
          FROM ECVendors v
          WHERE v.id = inventories.vendorId
          AND ISNULL(v.isActive, 1) = 1
        )
      `),
      );

    // conditions
    let firstPriceIncludeBuilder = new IncludeOptionsBuilder({
      model: ECInventoryPrice,
      as: 'firstPrice',
      required: false,
    })
      .attributes(priceRangeQuery ? [] : ['id', 'price'])
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

    // Batch filter by specific combinations of productId and inventoryId
    if (
      (filter as any).productInventoryPairs &&
      (filter as any).productInventoryPairs.length > 0
    ) {
      const pairs = (filter as any).productInventoryPairs as Array<{
        productId: number | string | bigint;
        inventoryId: number | string | bigint;
      }>;
      const inventoryIds = pairs
        .map((p) => Number(p.inventoryId))
        .filter((v) => !Number.isNaN(v));
      const productIds = pairs
        .map((p) => Number(p.productId))
        .filter((v) => !Number.isNaN(v));
      if (inventoryIds.length > 0 && productIds.length > 0) {
        // Restrict parents to productIds
        queryBuilder = queryBuilder.filter({
          id: {
            [Op.in]: productIds,
          },
        });
        queryResultBuilder = queryResultBuilder.filter({
          id: {
            [Op.in]: productIds,
          },
        });

        // Restrict included inventories to the provided inventory ids
        inventoryIncludeBuilder = inventoryIncludeBuilder.filter({
          id: {
            [Op.in]: inventoryIds,
          },
        });

        // Ensure a product is returned only if it has at least one of the requested inventories
        const existsRequestedInventory = Sequelize.literal(
          `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND [ECI].id IN (${inventoryIds.join(',')})
          )`.replaceAll(/\s\s+/g, ' '),
        );
        queryBuilder = queryBuilder.filter(existsRequestedInventory);
        queryResultBuilder = queryResultBuilder.filter(
          existsRequestedInventory,
        );
      }
    }

    if (filter.vendorIds != null && filter.vendorIds.length > 0) {
      const vendorFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            LEFT JOIN ECVendors V ON ECI.vendorId = V.id
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND ISNULL(V.isActive, 1) = 1
              AND [ECI].vendorId IN(
                ${filter.vendorIds.join(',')})
              )`.replaceAll(/\s\s+/g, ' '),
      );
      queryBuilder = queryBuilder.filter(vendorFiltered);
      queryResultBuilder = queryResultBuilder.filter(vendorFiltered);
      inventoryIncludeBuilder = inventoryIncludeBuilder.filter({
        vendorId: {
          [Op.in]: filter.vendorIds,
        },
      });
    }

    if (filter.colors != null && filter.colors.length > 0) {
      // AND [ECI].inventoryStatusId = ${InventoryStatusEnum.available}
      const colorFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            LEFT JOIN ECVendors V ON ECI.vendorId = V.id
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND ISNULL(V.isActive, 1) = 1
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
            LEFT JOIN ECVendors V
              ON ECI.vendorId = V.id
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND ISNULL(V.isActive, 1) = 1
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
            LEFT JOIN ECVendors V
              ON ECI.vendorId = V.id
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND ISNULL(V.isActive, 1) = 1
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

    if (filter.discountTypeId != null) {
      const discountTypeFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            LEFT JOIN ECVendors V
              ON ECI.vendorId = V.id
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND ISNULL(V.isActive, 1) = 1
              AND ECI.inventoryStatusId = ${InventoryStatusEnum.available}
              AND ECI.discountTypeId = ${filter.discountTypeId}
              AND getdate() between isnull(ECI.discountStartDate, getdate())
                AND isnull(ECI.discountEndDate, getdate())
            )`.replaceAll(/\s\s+/g, ' '),
      );
      queryBuilder = queryBuilder.filter(discountTypeFiltered);
      queryResultBuilder = queryResultBuilder.filter(discountTypeFiltered);
      inventoryIncludeBuilder
        .filter({ discountTypeId: filter.discountTypeId })
        .filter(
          Sequelize.where(Sequelize.fn('getdate'), {
            [Op.between]: [
              Sequelize.fn(
                'isnull',
                Sequelize.col('inventories.discountStartDate'),
                Sequelize.fn('getdate'),
              ),
              Sequelize.fn(
                'isnull',
                Sequelize.col('inventories.discountEndDate'),
                Sequelize.fn('getdate'),
              ),
            ],
          }),
        );
    }

    if (filter.vendorId) {
      // AND [ECI].inventoryStatusId = ${InventoryStatusEnum.available}
      const vendorFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECInventories AS ECI
            LEFT JOIN ECVendors V ON ECI.vendorId = V.id
            WHERE [ECProduct].id = [ECI].productId
              AND ISNULL([ECI].isDeleted, 0) = 0
              AND ISNULL(V.isActive, 1) = 1
              AND [ECI].vendorId = ${filter.vendorId}
          )`.replaceAll(/\s\s+/g, ' '),
      );
      queryBuilder.filter(vendorFiltered);
      queryResultBuilder.filter(vendorFiltered);
      inventoryIncludeBuilder.filter({ vendorId: filter.vendorId });
    }

    if (filter.selectedProductId) {
      // AND [ECI].inventoryStatusId = ${InventoryStatusEnum.available}
      const productSelectFiltered = Sequelize.literal(
        `EXISTS (
            SELECT 1
            FROM ECSelectedProductItems AS ESPI
            WHERE [ECProduct].id = [ESPI].productId
              AND [ESPI].selectedProductId = ${filter.selectedProductId}
          )`.replaceAll(/\s\s+/g, ' '),
      );
      queryBuilder.filter(productSelectFiltered);
      queryResultBuilder.filter(productSelectFiltered);
    }

    // add first price
    inventoryIncludeBuilder = inventoryIncludeBuilder.thenInclude(
      firstPriceIncludeBuilder.build(),
    );

    queryResultBuilder = queryResultBuilder.thenInclude(
      inventoryIncludeBuilder.build(),
    );

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
      queryResultBuilder.thenInclude(attributeIncludeBuilder.build());
    }

    if (filter.attributes != null && filter.attributes.length > 0) {
      for (const attribute of filter.attributes) {
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

    queryResultBuilder = queryResultBuilder
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'fileName'],
        through: {
          attributes: [],
        },
        model: Attachment,
        as: 'attachments',
        required: false,
      })
      .thenInclude({
        attributes: priceRangeQuery ? [] : ['id', 'fileName'],
        through: {
          attributes: [],
        },
        model: Attachment,
        as: 'videoAttachments',
        required: false,
      });

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
          'lastPrice',
          'weight',
          'cntComment',
          'score',
          'wages',
          'createdAt',
          'updatedAt',
        ];
    if (slug) {
      resultQueryAttributes.push('description');
      resultQueryAttributes.push('metaTitle');
      resultQueryAttributes.push('metaKeywords');
      resultQueryAttributes.push('metaDescription');
    }
    queryResultBuilder = queryResultBuilder
      .attributes(resultQueryAttributes)
      .subQuery(true)
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: 'inventoryStatusId', sortOrder: 'ASC' });
    queryResultBuilder = await this.parseOrder(filter, queryResultBuilder);
    queryResultBuilder = queryResultBuilder.order([
      { model: ECInventory, as: 'inventories' },
      { model: ECInventoryPrice, as: 'firstPrice' },
      'price',
      'asc',
    ]);
    // queryResultBuilder = queryResultBuilder.order([
    //   { model: Attachment, as: 'attachments' },
    //   'id',
    //   'asc',
    // ]);
    return {
      resultQuery: queryResultBuilder.build(),
      countQuery: queryBuilder.build(),
    };
  }

  async parseOrder(
    filter: GetProductDto,
    queryBuilder: QueryOptionsBuilder,
  ): Promise<QueryOptionsBuilder> {
    if (filter.orderBy.startsWith('$')) {
      const items = filter.orderBy.replaceAll('$', '').split('.');
      const orders = [];
      for (let index = 0; index < items.length; index++) {
        const order = items[index];
        if (index == items.length - 1) {
          orders.push(...[order, filter.sortOrder]);
        } else {
          let orderItemAssociation: { model: ModelStatic<Model>; as: string };
          switch (order) {
            case 'vendor':
              orderItemAssociation = { model: ECVendor, as: order };
              orders.push(orderItemAssociation);
              break;
            case 'inventories':
              orderItemAssociation = { model: ECInventory, as: order };
              orders.push(orderItemAssociation);
              break;
            case 'firstPrice':
              orderItemAssociation = { model: ECInventoryPrice, as: order };
              orders.push(orderItemAssociation);
              break;
            case 'secondarayPrice':
              orderItemAssociation = { model: ECInventoryPrice, as: order };
              orders.push(orderItemAssociation);
              break;
            case 'attachments':
              orderItemAssociation = { model: Attachment, as: order };
              orders.push(orderItemAssociation);
            default:
              throw new BadRequestException('the given format is not valid');
          }
        }
      }
      const orderItem: OrderItem = orders as OrderItem;
      queryBuilder = queryBuilder.order(orderItem);
    }
    if (filter.orderBy.startsWith('randomize')) {
      // const offsetRandom = await this.sequelize.query(
      //   `SELECT RAND(CHECKSUM(NEWID()))*SUM([rows]) as offset FROM sys.partitions
      //   WHERE index_id IN (0, 1) AND [object_id]=OBJECT_ID('dbo.ECProducts')`,
      //   { type: QueryTypes.SELECT, raw: true },
      // );

      const offsetRandom = await this.sequelize.query(
        `SELECT RAND(CHECKSUM(NEWID()))* count(*) as offset FROM ECProducts
        WHERE inventoryStatusId = ${InventoryStatusEnum.available}
           AND isnull(ECProducts.isDeleted, 0) = 0
           AND ECProducts.publishStatusId = ${PublishStatusEnum.publish}`
          .concat(
            filter.entityTypeId != undefined
              ? ` AND ECProducts.entityTypeId = ${filter.entityTypeId}`
              : ' AND 1=1',
          )
          .concat(
            filter.brands.length > 0
              ? ` AND ECProducts.brandId IN (${filter.brands.toString()})`
              : ' AND 1=1',
          ),
        {
          type: QueryTypes.SELECT,
          raw: true,
        },
      );

      let offset = Math.round(offsetRandom[0]['offset']) - filter.limit;
      if (offset < 0) {
        offset = 0;
      }
      queryBuilder = queryBuilder
        .offset(offset)
        .filter({ inventoryStatusId: InventoryStatusEnum.available });
    } else {
      queryBuilder = queryBuilder.order({
        orderBy: filter.orderBy,
        sortOrder: filter.sortOrder,
      });
    }
    return queryBuilder;
  }

  async filterEntityChild(
    builder: QueryOptionsBuilder,
    entityTypeId: number,
  ): Promise<QueryOptionsBuilder> {
    const entityTypeIds = [entityTypeId];
    const entityType = await this.entityTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            attributes: ['id', 'name', 'slug'],
            model: EAVEntityType,
            as: 'subEntityTypes',
            required: false,
            include: [
              {
                attributes: ['id', 'name', 'slug'],
                model: EAVEntityType,
                as: 'subEntityTypes',
                required: false,
                include: [
                  {
                    attributes: ['id', 'fileName'],
                    model: Attachment,
                    as: 'attachment',
                    required: false,
                  },
                ],
              },
              {
                attributes: ['id', 'fileName'],
                model: Attachment,
                as: 'attachment',
                required: false,
              },
            ],
          },
        ])
        .build(),
    );
    if (entityType) {
      for (const firstChild of entityType.subEntityTypes) {
        entityTypeIds.push(firstChild.id);
        for (const secondChild of firstChild.subEntityTypes) {
          entityTypeIds.push(secondChild.id);
        }
      }
    }
    builder = builder.filter({
      entityTypeId: {
        [Op.in]: entityTypeIds,
      },
    });
    return builder;
  }
}
