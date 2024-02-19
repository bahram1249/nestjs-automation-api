import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
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
import { InventoryValidationService } from '@rahino/ecommerce/inventory/inventory-validation.service';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { InventoryService } from '@rahino/ecommerce/inventory/inventory.service';
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
import { inventoryStatusService } from '@rahino/ecommerce/inventory/inventory-status.service';

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
    private readonly inventoryStatusService: inventoryStatusService,
    @Inject(emptyListFilter) private readonly listFilter: ListFilter,
    private config: ConfigService,
  ) {}

  async findAll(user: User, filter: GetProductDto) {
    const vendorResult = await this.userVendorService.findAll(
      user,
      this.listFilter,
    );

    const vendorIds = vendorResult.result.map((vendor) => vendor.id);

    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECProduct.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );

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
          model: ECInventory,
          as: 'inventories',
          where: {
            vendorId: {
              [Op.in]: vendorIds,
            },
          },
          include: [
            {
              attributes: ['id', 'name'],
              model: ECInventoryStatus,
              as: 'inventoryStatus',
            },
            {
              attributes: ['id', 'name'],
              model: ECVendor,
              as: 'vendor',
            },
            {
              attributes: ['id', 'name', 'hexCode'],
              model: ECColor,
              as: 'color',
            },
            {
              attributes: ['id', 'name'],
              model: ECGuarantee,
              as: 'guarantee',
            },
            {
              attributes: ['id', 'name'],
              model: ECGuaranteeMonth,
              as: 'guaranteeMonth',
            },
            {
              attributes: ['id', 'name'],
              model: ECProvince,
              as: 'onlyProvince',
            },
            {
              model: ECVendorAddress,
              as: 'vendorAddress',
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
                  include: [
                    {
                      attributes: ['id', 'name'],
                      model: ECProvince,
                      as: 'province',
                    },
                    {
                      attributes: ['id', 'name'],
                      model: ECCity,
                      as: 'city',
                    },
                    {
                      attributes: ['id', 'name'],
                      model: ECNeighborhood,
                      as: 'neighborhood',
                    },
                  ],
                },
                {
                  attributes: ['id', 'name'],
                  model: ECVendor,
                  as: 'vendor',
                },
              ],
            },
            {
              attributes: ['price'],
              model: ECInventoryPrice,
              as: 'firstPrice',
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
      ])
      .subQuery(false)
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

  async findById(id: bigint) {
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
          id: id,
        })
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

    const transaction = await new Sequelize().transaction();
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

      product = await this.repository.create(insertItem, {
        transaction: transaction,
      });

      // insert product photos
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

      await this.inventoryStatusService.productInventoryStatusUpdate(
        product.id,
        transaction,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw new InternalServerErrorException(
        'transaction of creating product failed',
      );
    }

    return {
      result: await this.findById(product.id),
    };
  }

  async update(entityId: bigint, dto: ProductDto) {
    throw new NotImplementedException();
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
