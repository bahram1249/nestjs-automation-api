import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { GetProductDto, ProductDto } from './dto';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { EntityAttributeValueService } from '@rahino/eav/admin/entity-attribute-value/entity-attribute-value.service';
import { ProductAttributeDto } from './dto/product-attribute.dto';
import { EntityAttributeValueDto } from '@rahino/eav/admin/entity-attribute-value/dto';
import { EntityService } from '@rahino/eav/admin/entity/entity.service';
import { ConfigService } from '@nestjs/config';
import { User } from '@rahino/database/models/core/user.entity';
import { ECPublishStatus } from '@rahino/database/models/ecommerce-eav/ec-publish-status.entity';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';
import { ECBrand } from '@rahino/database/models/ecommerce-eav/ec-brand.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { EAVEntityAttributeValue } from '@rahino/database/models/eav/eav-entity-attribute-value.entity';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVAttributeValue } from '@rahino/database/models/eav/eav-attribute-value';
import { ProductPhotoService } from '@rahino/ecommerce/product-photo/product-photo.service';
import { ProductPhotoDto } from './dto/product-photo.dto';
import { PhotoDto } from '@rahino/ecommerce/product-photo/dto';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import {
  InventoryService,
  InventoryValidationService,
} from '@rahino/ecommerce/inventory/services';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { UserVendorService } from '@rahino/ecommerce/user/vendor/user-vendor.service';
import { ListFilter } from '@rahino/query-filter';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECVendorAddress } from '@rahino/database/models/ecommerce-eav/ec-vendor-address.entity';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { emptyListFilter } from '@rahino/query-filter/provider/constants';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { ECCity } from '@rahino/database/models/ecommerce-eav/ec-city.entity';
import { ECNeighborhood } from '@rahino/database/models/ecommerce-eav/ec-neighborhood.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import {
  Constants,
  PRODUCT_INVENTORY_STATUS_QUEUE,
} from '@rahino/ecommerce/inventory/constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    @InjectModel(EAVEntityType)
    private readonly entityType: typeof EAVEntityType,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly entityAttributeValueService: EntityAttributeValueService,
    private readonly entityService: EntityService,
    private readonly productPhotoService: ProductPhotoService,
    private readonly inventoryValidationService: InventoryValidationService,
    private readonly inventoryService: InventoryService,
    private readonly userVendorService: UserVendorService,
    @Inject(emptyListFilter)
    private readonly listFilter: ListFilter,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectQueue(PRODUCT_INVENTORY_STATUS_QUEUE)
    private productInventoryQueue: Queue,
    private config: ConfigService,
  ) {}

  async findAll(user: User, filter: GetProductDto) {
    const vendorResult = await this.userVendorService.findAll(
      user,
      this.listFilter,
    );

    const vendorIds = vendorResult.result.map((vendor) => vendor.id);

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
      });

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
        'publishStatusId',
        'viewCount',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
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
            'description',
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
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('inventories.isDeleted'),
                  0,
                ),
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

  async findById(user: User, id: bigint) {
    const vendorResult = await this.userVendorService.findAll(
      user,
      this.listFilter,
    );

    const vendorIds = vendorResult.result.map((vendor) => vendor.id);
    const product = await this.repository.findOne(
      new QueryOptionsBuilder()
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
              'description',
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
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('inventories.isDeleted'),
                    0,
                  ),
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
          },
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachments',
            required: false,
          },
        ])
        .subQuery(true)

        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECProduct.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          id: id,
        })
        .order({ orderBy: 'id', sortOrder: 'desc' })
        .order([
          { model: ECInventory, as: 'inventories' },
          { model: ECVendor, as: 'vendor' },
          'priorityOrder',
          'asc',
        ])
        .build(),
    );
    if (!product) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: product,
    };
  }

  async findByIdAnyway(user: User, id: bigint) {
    const vendorResult = await this.userVendorService.findAll(
      user,
      this.listFilter,
    );

    const vendorIds = vendorResult.result.map((vendor) => vendor.id);
    const product = await this.repository.findOne(
      new QueryOptionsBuilder()
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
              'description',
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
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('inventories.isDeleted'),
                    0,
                  ),
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
          },
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachments',
            required: false,
          },
        ])
        .subQuery(true)
        .filter({
          id: id,
        })
        .order({ orderBy: 'id', sortOrder: 'desc' })
        .order([
          { model: ECInventory, as: 'inventories' },
          { model: ECVendor, as: 'vendor' },
          'priorityOrder',
          'asc',
        ])
        .build(),
    );
    if (!product) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: product,
    };
  }

  async create(user: User, dto: ProductDto) {
    // find the slug if exists before
    const slugSearch = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ slug: dto.slug })
        .build(),
    );
    if (slugSearch) {
      throw new BadRequestException(
        'the item with this given slug is exists before !',
      );
    }

    // validation of entityType is linked to ecommerce model
    const ecommerceEntityModel = 1;
    const entityType = await this.entityType.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.entityTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          entityModelId: ecommerceEntityModel,
        })
        .build(),
    );
    if (!entityType) {
      throw new BadRequestException(
        `the given entityType->${dto.entityTypeId} isn't exists`,
      );
    }

    // validation of attributes

    const mappedAttributes = _.map(dto.attributes, (attribute) =>
      this.mapper.map(attribute, ProductAttributeDto, EntityAttributeValueDto),
    );
    await this.entityAttributeValueService.validation(
      dto.entityTypeId,
      mappedAttributes,
    );

    // validation of photos
    const mappedPhotos = _.map(dto.photos, (photo) =>
      this.mapper.map(photo, ProductPhotoDto, PhotoDto),
    );
    await this.productPhotoService.validationExistsPhoto(mappedPhotos);

    // validation of inventories
    await this.inventoryValidationService.validation(
      user,
      dto,
      dto.inventories,
    );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let product: ECProduct = null;
    try {
      // map item to product
      const mappedItem = this.mapper.map(dto, ProductDto, ECProduct);
      const { result } = await this.entityService.create(
        {
          entityTypeId: mappedItem.entityTypeId,
        },
        transaction,
      );

      const skuPrefix = this.config.get<string>('SKU_PREFIX');

      const insertItem = _.omit(mappedItem.toJSON(), ['id']);
      insertItem.id = result.entityId;
      insertItem.sku = skuPrefix + result.entityId.toString();
      insertItem.inventoryStatusId = InventoryStatusEnum.unavailable;
      insertItem.userId = user.id;
      insertItem.viewCount = 0;
      if (dto.inventories.length > 0) {
        insertItem.lastPrice = dto.inventories[0].firstPrice;
      }

      product = await this.repository.create(insertItem, {
        transaction: transaction,
      });

      // insert new product photos
      await this.productPhotoService.insert(
        product.id,
        mappedPhotos,
        transaction,
      );

      // insert attributes
      await this.entityAttributeValueService.insert(
        product.id,
        mappedAttributes,
        transaction,
      );

      // insert inventories
      await this.inventoryService.bulkInsert(
        user,
        product.id,
        dto.inventories,
        transaction,
      );

      await transaction.commit();

      const keepJobs = this.config.get<number>(
        'PRODUCT_INVENTORY_STATUS_KEEPJOBS',
      );
      await this.productInventoryQueue.add(
        Constants.productInventoryStatusJob(product.id.toString()),
        {
          productId: product.id,
        },
        { removeOnComplete: keepJobs },
      );
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }

    return {
      result: (await this.findById(user, product.id)).result,
    };
  }

  async update(entityId: bigint, user: User, dto: ProductDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
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
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECProduct.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          id: entityId,
        })
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    // find the slug if exists before
    const slugSearch = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          id: {
            [Op.ne]: entityId,
          },
        })
        .filter({ slug: dto.slug })
        .build(),
    );
    if (slugSearch) {
      throw new BadRequestException(
        'the item with this given slug is exists before !',
      );
    }

    // validation of entityType is linked to ecommerce model
    const ecommerceEntityModel = 1;
    const entityType = await this.entityType.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.entityTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          entityModelId: ecommerceEntityModel,
        })
        .build(),
    );
    if (!entityType) {
      throw new BadRequestException(
        `the given entityType->${dto.entityTypeId} isn't exists`,
      );
    }

    // validation of attributes

    const mappedAttributes = _.map(dto.attributes, (attribute) =>
      this.mapper.map(attribute, ProductAttributeDto, EntityAttributeValueDto),
    );
    await this.entityAttributeValueService.validation(
      dto.entityTypeId,
      mappedAttributes,
    );

    // validation of photos
    const mappedPhotos = _.map(dto.photos, (photo) =>
      this.mapper.map(photo, ProductPhotoDto, PhotoDto),
    );
    await this.productPhotoService.validationExistsPhoto(mappedPhotos);

    // validation of inventories
    await this.inventoryValidationService.validation(
      user,
      dto,
      dto.inventories,
    );

    // beign transaction
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let product: ECProduct = null;
    try {
      // map item to product
      const mappedItem = this.mapper.map(dto, ProductDto, ECProduct);
      // update product item
      const updateItem = _.omit(mappedItem.toJSON(), ['id']);
      if (dto.inventories.length > 0) {
        updateItem.lastPrice = dto.inventories[0].firstPrice;
      }
      const updated = await this.repository.update(updateItem, {
        where: {
          id: entityId,
        },
        returning: true,
        transaction: transaction,
      });
      product = updated[1][0];

      // remove photos
      await this.productPhotoService.removePhotosByProductId(
        product.id,
        transaction,
      );

      // insert product photos
      await this.productPhotoService.insert(
        product.id,
        mappedPhotos,
        transaction,
      );

      // remove attributes

      await this.entityAttributeValueService.removeByEntityId(
        product.id,
        transaction,
      );

      // insert attributes
      await this.entityAttributeValueService.insert(
        product.id,
        mappedAttributes,
        transaction,
      );

      // all vendor this user have access
      const vendorResult = await this.userVendorService.findAll(
        user,
        this.listFilter,
      );
      const vendorIds = vendorResult.result.map((vendor) => vendor.id);

      // all new inventory item
      const newItemInventories = dto.inventories.filter(
        (item) => item.id == null,
      );

      // all old inventory item that send
      const oldItemInventories = dto.inventories.filter(
        (item) => item.id != null,
      );
      const oldItemInvenotryIds = oldItemInventories.map((item) => item.id);

      // all old inventories exists in database
      const allOldInventories = await this.inventoryService.findByVendorIds(
        vendorIds,
        entityId,
      );

      // find the items not exists in dto's for deleting in database
      const deletedInventoryIds = allOldInventories
        .filter(
          (item) =>
            oldItemInvenotryIds.findIndex((value) => value == item.id) == -1,
        )
        .map((item) => item.id);

      // deleting inventories
      await this.inventoryService.removeInventories(
        user,
        deletedInventoryIds,
        transaction,
      );

      // updating old items
      await this.inventoryService.bulkUpdate(
        user,
        oldItemInventories,
        transaction,
      );

      // insert new inventories
      await this.inventoryService.bulkInsert(
        user,
        product.id,
        newItemInventories,
        transaction,
      );

      await transaction.commit();

      const keepJobs = this.config.get<number>(
        'PRODUCT_INVENTORY_STATUS_KEEPJOBS',
      );
      await this.productInventoryQueue.add(
        Constants.productInventoryStatusJob(product.id.toString()),
        {
          productId: product.id,
        },
        { removeOnComplete: keepJobs },
      );
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message, error);
    }

    return {
      result: (await this.findById(user, product.id)).result,
    };
  }

  async deleteById(entityId: bigint) {
    let product = await this.repository.findOne(
      new QueryOptionsBuilder()
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
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECProduct.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          id: entityId,
        })
        .build(),
    );
    if (!product) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    product.isDeleted = true;
    product = await product.save();
    return {
      result: product,
    };
  }
}
