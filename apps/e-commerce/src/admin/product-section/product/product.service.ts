import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { GetProductDto, ProductDto } from './dto';
import {
  ECProduct,
  ECSlugVersion,
  ECInventoryStatus,
  ECBrand,
  EAVEntityType,
  ECPublishStatus,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import { EntityAttributeValueService } from '@rahino/eav/admin/entity-attribute-value/entity-attribute-value.service';
import { ProductAttributeDto } from './dto/product-attribute.dto';
import { EntityAttributeValueDto } from '@rahino/eav/admin/entity-attribute-value/dto';
import { EntityService } from '@rahino/eav/admin/entity/entity.service';
import { ConfigService } from '@nestjs/config';
import { ProductPhotoService } from '@rahino/ecommerce/admin/product-section/product-photo/product-photo.service';
import { ProductAttachmentDto } from './dto/product-attachment.dto';
import { PhotoDto } from '@rahino/ecommerce/admin/product-section/product-photo/dto';
import {
  InventoryStatusEnum,
  VariationPriceIdEnum,
} from '@rahino/ecommerce/shared/inventory/enum';
import {
  InventoryService,
  InventoryValidationService,
} from '@rahino/ecommerce/shared/inventory/services';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { ListFilter } from '@rahino/query-filter';
import { emptyListFilter } from '@rahino/query-filter/provider/constants';
import {
  Constants,
  PRODUCT_INVENTORY_STATUS_QUEUE,
} from '@rahino/ecommerce/shared/inventory/constants';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ProductVideoService } from '@rahino/ecommerce/admin/product-section/product-video/product-video.service';
import { VideoDto } from '@rahino/ecommerce/admin/product-section/product-video/dto';
import { SlugVersionTypeEnum } from '@rahino/ecommerce/shared/enum';
import { PermissionService } from '@rahino/core/user/permission/permission.service';
import { ProductQueryBuilderService } from './query-builder/product-query-builder.service';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ECProduct)
    private readonly repository: typeof ECProduct,
    @InjectModel(EAVEntityType)
    private readonly entityType: typeof EAVEntityType,
    @InjectModel(ECSlugVersion)
    private readonly slugVersionRepository: typeof ECSlugVersion,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly entityAttributeValueService: EntityAttributeValueService,
    private readonly entityService: EntityService,
    private readonly productPhotoService: ProductPhotoService,
    private readonly productVideoService: ProductVideoService,
    private readonly inventoryValidationService: InventoryValidationService,
    private readonly inventoryService: InventoryService,
    private readonly userVendorService: UserVendorService,
    private readonly permissionService: PermissionService,
    @Inject(emptyListFilter)
    private readonly listFilter: ListFilter,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectQueue(PRODUCT_INVENTORY_STATUS_QUEUE)
    private readonly productInventoryQueue: Queue,
    private readonly config: ConfigService,
    private readonly productQueryBuilderService: ProductQueryBuilderService,
    private readonly emptyFilter: ListFilterV2Factory,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(user: User, filter: GetProductDto) {
    const vendorResult = await this.userVendorService.findAll(
      user,
      this.listFilter,
    );

    const vendorIds = vendorResult.result.map((vendor) => vendor.id);

    const { countQuery, resultQuery } =
      await this.productQueryBuilderService.findAllAndCount(vendorIds, filter);

    return {
      result: await this.repository.findAll(resultQuery),
      total: await this.repository.count(countQuery), //count,
    };
  }

  async findById(user: User, id: bigint) {
    const vendorResult = await this.userVendorService.findAll(
      user,
      this.listFilter,
    );

    const vendorIds = vendorResult.result.map((vendor) => vendor.id);

    let filter = await this.emptyFilter.create();
    const productFilter = filter as GetProductDto;
    productFilter.includeAttribute = true;

    const { countQuery, resultQuery } =
      await this.productQueryBuilderService.findAllAndCount(
        vendorIds,
        productFilter,
        id,
      );

    const product = await this.repository.findOne(resultQuery);
    if (!product) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    return {
      result: product,
    };
  }

  async findByIdAnyway(user: User, id: bigint) {
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
          'weight',
          'productFormulaId',
          'wages',
          'stoneMoney',
        ])
        .filter({
          id: id,
        })
        .order({ orderBy: 'id', sortOrder: 'desc' })

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
    const customerName = this.config.get<string>('SITE_NAME');
    if (customerName == 'goldongallery' || customerName == 'pegahgallery') {
      for (const inventory of dto.inventories) {
        inventory.firstPrice = BigInt(0);
      }
    }
    // add symbol price to inventoryPrices
    for (const inventory of dto.inventories) {
      if (inventory.inventoryPrices == null) {
        inventory.inventoryPrices = [];
      }
      if (inventory.firstPrice != null) {
        inventory.inventoryPrices.push({
          variationPriceId: VariationPriceIdEnum.firstPrice,
          price: inventory.firstPrice,
        });
      }
      if (inventory.secondaryPrice != null) {
        inventory.inventoryPrices.push({
          variationPriceId: VariationPriceIdEnum.secondaryPrice,
          price: inventory.secondaryPrice,
        });
      }
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
        .filter({ slug: dto.slug })
        .build(),
    );
    if (slugSearch) {
      throw new BadRequestException(
        'the item with this given slug is exists before !',
      );
    }

    // validation of entityType is linked to e-commerce model
    const eCommerceEntityModel = 1;
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
          entityModelId: eCommerceEntityModel,
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
      this.mapper.map(photo, ProductAttachmentDto, PhotoDto),
    );
    await this.productPhotoService.validationExistsPhoto(mappedPhotos);

    // validation of videos
    const mappedVideos = _.map(dto.videos, (video) =>
      this.mapper.map(video, ProductAttachmentDto, VideoDto),
    );

    await this.productVideoService.validationExistsVideo(mappedVideos);

    // validation of inventories
    await this.inventoryValidationService.validation(
      user,
      dto,
      dto.inventories,
    );

    // begin transaction
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

      await this.slugVersionRepository.create(
        {
          entityId: product.id,
          slug: product.slug,
          slugVersionTypeId: SlugVersionTypeEnum.Product,
        },
        {
          transaction: transaction,
        },
      );

      // insert new product photos
      await this.productPhotoService.insert(
        product.id,
        mappedPhotos,
        transaction,
      );

      // insert new product videos
      await this.productVideoService.insert(
        product.id,
        mappedVideos,
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
        dto,
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
    const customerName = this.config.get<string>('SITE_NAME');
    if (customerName == 'goldongallery' || customerName == 'pegahgallery') {
      for (const inventory of dto.inventories) {
        inventory.firstPrice = BigInt(0);
      }
    }
    // add symbol price to inventoryPrices
    for (const inventory of dto.inventories) {
      if (inventory.inventoryPrices == null) {
        inventory.inventoryPrices = [];
      }
      if (inventory.firstPrice != null) {
        inventory.inventoryPrices.push({
          variationPriceId: VariationPriceIdEnum.firstPrice,
          price: inventory.firstPrice,
        });
      }
      if (inventory.secondaryPrice != null) {
        inventory.inventoryPrices.push({
          variationPriceId: VariationPriceIdEnum.secondaryPrice,
          price: inventory.secondaryPrice,
        });
      }
    }

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
          'weight',
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

    const superEditSymbol = 'ecommerce.admin.products.superedit';
    const { result: superEditAccess } = await this.permissionService.isAccess(
      user,
      superEditSymbol,
    );

    if (superEditAccess) {
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

      // validation of entityType is linked to e-commerce model
      const eCommerceEntityModel = 1;
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
            entityModelId: eCommerceEntityModel,
          })
          .build(),
      );
      if (!entityType) {
        throw new BadRequestException(
          `the given entityType->${dto.entityTypeId} isn't exists`,
        );
      }
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
      this.mapper.map(photo, ProductAttachmentDto, PhotoDto),
    );
    await this.productPhotoService.validationExistsPhoto(mappedPhotos);

    // validation of videos
    const mappedVideos = _.map(dto.videos, (video) =>
      this.mapper.map(video, ProductAttachmentDto, VideoDto),
    );
    await this.productVideoService.validationExistsVideo(mappedVideos);

    // validation of inventories
    await this.inventoryValidationService.validation(
      user,
      dto,
      dto.inventories,
    );

    // begin transaction
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let product: ECProduct = null;
    try {
      if (superEditAccess) {
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

        const findSlug = await this.slugVersionRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ entityId: product.id })
            .filter({ slugVersionTypeId: SlugVersionTypeEnum.Product })
            .filter({ slug: product.slug })
            .build(),
        );
        if (!findSlug) {
          await this.slugVersionRepository.create(
            {
              entityId: product.id,
              slug: product.slug,
              slugVersionTypeId: SlugVersionTypeEnum.Product,
            },
            {
              transaction: transaction,
            },
          );
        }

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

        // remove videos
        await this.productVideoService.removeVideosByProductId(
          product.id,
          transaction,
        );

        // insert product videos
        await this.productVideoService.insert(
          product.id,
          mappedVideos,
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
      }

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
      const oldItemInventoryIds = oldItemInventories.map((item) => item.id);

      // all old inventories exists in database
      const allOldInventories = await this.inventoryService.findByVendorIds(
        vendorIds,
        entityId,
      );

      // find the items not exists in dto's for deleting in database
      const deletedInventoryIds = allOldInventories
        .filter(
          (item) =>
            oldItemInventoryIds.findIndex((value) => value == item.id) == -1,
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
        dto,
        oldItemInventories,
        transaction,
      );

      // insert new inventories
      await this.inventoryService.bulkInsert(
        user,
        entityId,
        dto,
        newItemInventories,
        transaction,
      );

      await transaction.commit();

      const keepJobs = this.config.get<number>(
        'PRODUCT_INVENTORY_STATUS_KEEPJOBS',
      );
      await this.productInventoryQueue.add(
        Constants.productInventoryStatusJob(entityId.toString()),
        {
          productId: entityId,
        },
        { removeOnComplete: keepJobs },
      );
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message, error);
    }

    return {
      result: (await this.findById(user, entityId)).result,
    };
  }

  async deleteById(entityId: bigint) {
    let product = await this.repository.findOne(
      new QueryOptionsBuilder()
        // .attributes([
        //   'id',
        //   'title',
        //   'sku',
        //   'description',
        //   'slug',
        //   'entityTypeId',
        //   'colorBased',
        //   'brandId',
        //   'publishStatusId',
        //   'viewCount',
        //   'metaTitle',
        //   'metaKeywords',
        //   'metaDescription',
        //   'weight',
        // ])
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
      result: _.pick(product, [
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
      ]),
    };
  }
}
