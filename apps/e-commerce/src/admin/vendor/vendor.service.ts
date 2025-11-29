import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VendorDto, GetVendorDto, VendorUserDto, VendorV2Dto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import {
  ECCity,
  ECProvince,
  ECVendor,
  ECVendorLogistic,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { Role } from '@rahino/database';
import { UserRoleService } from '@rahino/core/admin/user-role/user-role.service';
import { ECVendorUser } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { MinioClientService } from '@rahino/minio-client';
import * as fs from 'fs';
import { ThumbnailService } from '@rahino/thumbnail';
import { ECVendorCommission } from '@rahino/localdatabase/models';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { ECVendorCommissionType } from '@rahino/localdatabase/models';
import { LocalizationService } from 'apps/main/src/common/localization';
import { isNotNull } from '@rahino/commontools';
import { ECRoleEnum } from '@rahino/ecommerce/shared/enum';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { VENDOR_QUEUE } from '../../job/vendor-inventory/constants';

@Injectable()
export class VendorService {
  private readonly vendorAttachmentType = 11;
  private readonly vendorRoleStatic = ECRoleEnum.Vendor;
  constructor(
    @InjectQueue(VENDOR_QUEUE)
    private readonly vendorQueue: Queue,
    @InjectModel(ECVendor)
    private readonly repository: typeof ECVendor,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(ECVendorUser)
    private readonly vendorUserRepository: typeof ECVendorUser,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly userRoleService: UserRoleService,
    private readonly minioClientService: MinioClientService,
    private readonly thumbnailService: ThumbnailService,
    @InjectModel(ECVendorCommission)
    private readonly commissionRepository: typeof ECVendorCommission,
    @InjectModel(ECVariationPrice)
    private readonly variationPriceRepository: typeof ECVariationPrice,
    @InjectModel(ECProvince)
    private readonly provinceRepository: typeof ECProvince,
    @InjectModel(ECCity)
    private readonly cityRepository: typeof ECCity,

    @InjectModel(ECVendorLogistic)
    private readonly vendorLogisticRepository: typeof ECVendorLogistic,

    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetVendorDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .filterIf(isNotNull(filter.search), {
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .attributes([
        'id',
        'name',
        'slug',
        'address',
        'priorityOrder',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'isActive',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          model: ECVendorUser,
          as: 'vendorUser',
          include: [
            {
              attributes: [
                'id',
                'firstname',
                'lastname',
                'username',
                'phoneNumber',
              ],
              model: User,
              as: 'user',
            },
          ],
          where: {
            [Op.and]: [
              {
                isDefault: true,
              },
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('vendorUser.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            ],
          },
          required: false,
        },
        {
          attributes: [
            'id',
            'vendorId',
            'variationPriceId',
            'amount',
            'commissionTypeId',
          ],
          model: ECVendorCommission,
          as: 'commissions',
          where: Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
            {
              attributes: ['id', 'name'],
              model: ECVendorCommissionType,
              as: 'commissionType',
            },
          ],
          required: false,
        },
        {
          attributes: ['id', 'vendorId', 'logisticId', 'isDefault'],
          model: ECVendorLogistic,
          as: 'vendorLogistic',
          required: false,
          where: {
            [Op.and]: [
              { isDefault: true },
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('vendorLogistic.isDeleted'),
                  0,
                ),
                { [Op.eq]: 0 },
              ),
            ],
          },
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findAllV2(filter: GetVendorDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .filterIf(isNotNull(filter.search), {
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .attributes([
        'id',
        'name',
        'slug',
        'address',
        'priorityOrder',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'provinceId',
        'cityId',
        'coordinates',
        'latitude',
        'longitude',
        'isActive',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          model: ECVendorUser,
          as: 'vendorUser',
          include: [
            {
              attributes: [
                'id',
                'firstname',
                'lastname',
                'username',
                'phoneNumber',
              ],
              model: User,
              as: 'user',
            },
          ],
          where: {
            [Op.and]: [
              {
                isDefault: true,
              },
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('vendorUser.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            ],
          },
        },
        {
          attributes: [
            'id',
            'vendorId',
            'variationPriceId',
            'amount',
            'commissionTypeId',
          ],
          model: ECVendorCommission,
          as: 'commissions',
          where: Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
            {
              attributes: ['id', 'name'],
              model: ECVendorCommissionType,
              as: 'commissionType',
            },
          ],
        },
        {
          attributes: ['id', 'vendorId', 'logisticId', 'isDefault'],
          model: ECVendorLogistic,
          as: 'vendorLogistic',
          required: false,
          where: {
            [Op.and]: [
              { isDefault: true },
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('vendorLogistic.isDeleted'),
                  0,
                ),
                { [Op.eq]: 0 },
              ),
            ],
          },
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: number) {
    const vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'description',
          'address',
          'priorityOrder',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'isActive',
        ])
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
          {
            model: ECVendorUser,
            as: 'vendorUser',
            include: [
              {
                attributes: [
                  'id',
                  'firstname',
                  'lastname',
                  'username',
                  'phoneNumber',
                ],
                model: User,
                as: 'user',
              },
            ],
            where: {
              [Op.and]: [
                {
                  isDefault: true,
                },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorUser.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
          {
            attributes: [
              'id',
              'vendorId',
              'variationPriceId',
              'amount',
              'commissionTypeId',
            ],
            model: ECVendorCommission,
            as: 'commissions',
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
            include: [
              {
                attributes: ['id', 'name'],
                model: ECVariationPrice,
                as: 'variationPrice',
              },
              {
                attributes: ['id', 'name'],
                model: ECVendorCommissionType,
                as: 'commissionType',
              },
            ],
          },
          {
            attributes: ['id', 'vendorId', 'logisticId', 'isDefault'],
            model: ECVendorLogistic,
            as: 'vendorLogistic',
            required: false,
            where: {
              [Op.and]: [
                { isDefault: true },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorLogistic.isDeleted'),
                    0,
                  ),
                  { [Op.eq]: 0 },
                ),
              ],
            },
          },
        ])
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!vendor) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.vendor_not_found'),
      );
    }
    return {
      result: vendor,
    };
  }

  async findByIdV2(entityId: number) {
    const vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'description',
          'address',
          'priorityOrder',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'provinceId',
          'cityId',
          'coordinates',
          'latitude',
          'longitude',
          'isActive',
        ])
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
          {
            model: ECVendorUser,
            as: 'vendorUser',
            include: [
              {
                attributes: [
                  'id',
                  'firstname',
                  'lastname',
                  'username',
                  'phoneNumber',
                ],
                model: User,
                as: 'user',
              },
            ],
            where: {
              [Op.and]: [
                {
                  isDefault: true,
                },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorUser.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
          {
            attributes: [
              'id',
              'vendorId',
              'variationPriceId',
              'amount',
              'commissionTypeId',
            ],
            model: ECVendorCommission,
            as: 'commissions',
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
            include: [
              {
                attributes: ['id', 'name'],
                model: ECVariationPrice,
                as: 'variationPrice',
              },
              {
                attributes: ['id', 'name'],
                model: ECVendorCommissionType,
                as: 'commissionType',
              },
            ],
          },
          {
            attributes: ['id', 'vendorId', 'logisticId', 'isDefault'],
            model: ECVendorLogistic,
            as: 'vendorLogistic',
            required: false,
            where: {
              [Op.and]: [
                { isDefault: true },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorLogistic.isDeleted'),
                    0,
                  ),
                  { [Op.eq]: 0 },
                ),
              ],
            },
          },
        ])
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!vendor) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.vendor_not_found'),
      );
    }
    return {
      result: vendor,
    };
  }

  async create(user: User, dto: VendorDto) {
    // check for if slug exists before
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.the_given_slug_is_exists_before',
        ),
      );
    }

    // find vendor role
    const vendorRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: ECRoleEnum.Vendor })
        .build(),
    );
    if (!vendorRole) {
      throw new ForbiddenException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    // find user if exists before
    let userVendor = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ phoneNumber: dto.user.phoneNumber })
        .build(),
    );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let vendor: ECVendor = null;
    try {
      if (!userVendor) {
        const mappedUserItem = this.mapper.map(dto.user, VendorUserDto, User);
        const insertUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
        insertUserItem.username = mappedUserItem.phoneNumber;
        userVendor = await this.userRepository.create(insertUserItem, {
          transaction: transaction,
        });
      }

      // insert vendor role to user
      await this.userRoleService.insertRoleToUser(
        vendorRole,
        userVendor,
        transaction,
      );

      // mapped vendor item
      const mappedItem = this.mapper.map(dto, VendorDto, ECVendor);
      const insertItem = _.omit(mappedItem.toJSON(), ['id']);
      insertItem.userId = user.id;

      // create vendor
      vendor = await this.repository.create(insertItem, {
        transaction: transaction,
      });

      // insert default vendor user
      const vendorUser = await this.vendorUserRepository.create(
        {
          userId: userVendor.id,
          vendorId: vendor.id,
          isDefault: true,
        },
        { transaction: transaction },
      );

      if (isNotNull(dto.logisticId)) {
        await this.vendorLogisticRepository.create(
          {
            vendorId: vendor.id,
            logisticId: dto.logisticId,
            isDefault: true,
          },
          {
            transaction: transaction,
          },
        );
      }

      const variationPrices = await this.variationPriceRepository.findAll(
        new QueryOptionsBuilder().transaction(transaction).build(),
      );

      if (variationPrices.length > 0) {
        const requiedItems = dto.commissions.filter(
          (commission) =>
            variationPrices.findIndex(
              (variationPrice) =>
                variationPrice.id == commission.variationPriceId,
            ) != -1,
        );
        if (requiedItems.length != variationPrices.length) {
          throw new BadRequestException(
            this.localizationService.translate(
              'ecommerce.required_commission_types_not_sent',
            ),
          );
        }
      }

      await this.commissionRepository.update(
        {
          isDeleted: true,
        },
        {
          where: {
            vendorId: vendor.id,
          },
          transaction: transaction,
        },
      );

      for (let index = 0; index < dto.commissions.length; index++) {
        const commission = dto.commissions[index];
        await this.commissionRepository.create(
          {
            vendorId: vendor.id,
            commissionTypeId: 1,
            amount: commission.amount,
            variationPriceId: commission.variationPriceId,
          },
          {
            transaction: transaction,
          },
        );
      }
      if (dto.isActive == true) {
        await this.toggleInventories(vendor.id, true);
      } else {
        await this.toggleInventories(vendor.id, false);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'description',
          'address',
          'priorityOrder',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'isActive',
        ])
        .filter({ id: vendor.id })
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
          {
            model: ECVendorUser,
            as: 'vendorUser',
            where: {
              [Op.and]: [
                {
                  isDefault: true,
                },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorUser.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
          {
            attributes: [
              'id',
              'vendorId',
              'variationPriceId',
              'amount',
              'commissionTypeId',
            ],
            model: ECVendorCommission,
            as: 'commissions',
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
            include: [
              {
                attributes: ['id', 'name'],
                model: ECVariationPrice,
                as: 'variationPrice',
              },
              {
                attributes: ['id', 'name'],
                model: ECVendorCommissionType,
                as: 'commissionType',
              },
            ],
          },
        ])
        .build(),
    );

    return {
      result: vendor,
    };
  }

  async createV2(user: User, dto: VendorV2Dto) {
    // check for if slug exists before
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.the_given_slug_is_exists_before',
        ),
      );
    }

    const province = await this.provinceRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.provinceId }).build(),
    );

    if (!province) {
      throw new BadRequestException(
        this.localizationService.translate('ecommerce.province_not_found'),
      );
    }

    const city = await this.cityRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.cityId }).build(),
    );

    if (!city) {
      throw new BadRequestException(
        this.localizationService.translate('ecommerce.city_not_found'),
      );
    }

    // find vendor role
    const vendorRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: this.vendorRoleStatic })
        .build(),
    );
    if (!vendorRole) {
      throw new ForbiddenException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    // find user if exists before
    let userVendor = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ phoneNumber: dto.user.phoneNumber })
        .build(),
    );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let vendor: ECVendor = null;
    try {
      if (!userVendor) {
        const mappedUserItem = this.mapper.map(dto.user, VendorUserDto, User);
        const insertUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
        insertUserItem.username = mappedUserItem.phoneNumber;
        userVendor = await this.userRepository.create(insertUserItem, {
          transaction: transaction,
        });
      }

      // insert vendor role to user
      await this.userRoleService.insertRoleToUser(
        vendorRole,
        userVendor,
        transaction,
      );

      // mapped vendor item
      const mappedItem = this.mapper.map(dto, VendorV2Dto, ECVendor);
      mappedItem.coordinates = Sequelize.fn(
        'geography::STPointFromText',
        `POINT(${dto.longitude} ${dto.latitude})`,
        4326,
      );

      const insertItem = _.omit(mappedItem.toJSON(), ['id']);
      insertItem.userId = user.id;

      // create vendor
      vendor = await this.repository.create(insertItem, {
        transaction: transaction,
      });

      // insert default vendor user
      const vendorUser = await this.vendorUserRepository.create(
        {
          userId: userVendor.id,
          vendorId: vendor.id,
          isDefault: true,
        },
        { transaction: transaction },
      );

      const variationPrices = await this.variationPriceRepository.findAll(
        new QueryOptionsBuilder().transaction(transaction).build(),
      );

      if (variationPrices.length > 0) {
        const requiedItems = dto.commissions.filter(
          (commission) =>
            variationPrices.findIndex(
              (variationPrice) =>
                variationPrice.id == commission.variationPriceId,
            ) != -1,
        );
        if (requiedItems.length != variationPrices.length) {
          throw new BadRequestException(
            this.localizationService.translate(
              'ecommerce.required_commission_types_not_sent',
            ),
          );
        }
      }

      await this.commissionRepository.update(
        {
          isDeleted: true,
        },
        {
          where: {
            vendorId: vendor.id,
          },
          transaction: transaction,
        },
      );

      for (let index = 0; index < dto.commissions.length; index++) {
        const commission = dto.commissions[index];
        await this.commissionRepository.create(
          {
            vendorId: vendor.id,
            commissionTypeId: 1,
            amount: commission.amount,
            variationPriceId: commission.variationPriceId,
          },
          {
            transaction: transaction,
          },
        );
      }

      if (dto.isActive == true) {
        await this.toggleInventories(vendor.id, true);
      } else {
        await this.toggleInventories(vendor.id, false);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'description',
          'address',
          'priorityOrder',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'isActive',
        ])
        .filter({ id: vendor.id })
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
          {
            model: ECVendorUser,
            as: 'vendorUser',
            where: {
              [Op.and]: [
                {
                  isDefault: true,
                },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorUser.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
          {
            attributes: [
              'id',
              'vendorId',
              'variationPriceId',
              'amount',
              'commissionTypeId',
            ],
            model: ECVendorCommission,
            as: 'commissions',
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
            include: [
              {
                attributes: ['id', 'name'],
                model: ECVariationPrice,
                as: 'variationPrice',
              },
              {
                attributes: ['id', 'name'],
                model: ECVendorCommissionType,
                as: 'commissionType',
              },
            ],
          },
        ])
        .build(),
    );

    return {
      result: vendor,
    };
  }

  async update(entityId: number, dto: VendorDto) {
    // check for item is exists
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.vendor_not_found'),
      );
    }

    // check for if slug exists before
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
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
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.the_given_slug_is_exists_before',
        ),
      );
    }

    // find vendor role
    const vendorRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: ECRoleEnum.Vendor })
        .build(),
    );
    if (!vendorRole) {
      throw new ForbiddenException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    // find default user of this vendor
    let defaultVendorUser = await this.vendorUserRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: User,
            as: 'user',
          },
          {
            model: ECVendor,
            as: 'vendor',
          },
        ])
        .filter({ vendorId: item.id })
        .filter({ isDefault: true })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendorUser.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!defaultVendorUser) {
      throw new ForbiddenException(
        this.localizationService.translate(
          'ecommerce.default_vendor_user_not_found',
        ),
      );
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let vendor: ECVendor = null;
    try {
      if (defaultVendorUser.user.phoneNumber != dto.user.phoneNumber) {
        // remove default user of this vendor
        defaultVendorUser.isDeleted = true;
        defaultVendorUser = await defaultVendorUser.save({
          transaction: transaction,
        });

        // remove vendor role from this old user if is not exists in another vendor
        const existsInAnotherVendor = await this.vendorUserRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ userId: defaultVendorUser.user.id })
            .filter(
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('ECVendorUser.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            )
            .transaction(transaction)
            .build(),
        );
        if (!existsInAnotherVendor) {
          // remove vendor role
          await this.userRoleService.removeRoleFromUser(
            vendorRole,
            defaultVendorUser.user,
            transaction,
          );
        }

        // find user if exists before
        let userVendor = await this.userRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ phoneNumber: dto.user.phoneNumber })
            .transaction(transaction)
            .build(),
        );
        if (!userVendor) {
          // insert user if is not exists before
          const mappedUserItem = this.mapper.map(dto.user, VendorUserDto, User);
          const insertUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
          insertUserItem.username = mappedUserItem.phoneNumber;
          userVendor = await this.userRepository.create(insertUserItem, {
            transaction: transaction,
          });
        }

        // insert vendor role to user
        await this.userRoleService.insertRoleToUser(
          vendorRole,
          userVendor,
          transaction,
        );

        // insert user to this vendor as default
        const vendorUser = await this.vendorUserRepository.create(
          {
            userId: userVendor.id,
            vendorId: item.id,
            isDefault: true,
          },
          {
            transaction: transaction,
          },
        );
      } else {
        const mappedUserItem = this.mapper.map(dto.user, VendorUserDto, User);
        const updateUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
        updateUserItem.username = mappedUserItem.phoneNumber;
        await this.userRepository.update(updateUserItem, {
          where: { id: defaultVendorUser.user.id },
          transaction: transaction,
          returning: true,
        });
      }

      // mapped vendor item
      const mappedItem = this.mapper.map(dto, VendorDto, ECVendor);
      // update vendor item
      vendor = (
        await this.repository.update(_.omit(mappedItem.toJSON(), ['id']), {
          where: {
            id: entityId,
          },
          transaction: transaction,
          returning: true,
        })
      )[1][0];

      await this.upsertVendorLogistic(dto, vendor, transaction);

      const variationPrices = await this.variationPriceRepository.findAll(
        new QueryOptionsBuilder().transaction(transaction).build(),
      );

      if (variationPrices.length > 0) {
        const requiedItems = dto.commissions.filter(
          (commission) =>
            variationPrices.findIndex(
              (variationPrice) =>
                variationPrice.id == commission.variationPriceId,
            ) != -1,
        );
        if (requiedItems.length != variationPrices.length) {
          throw new BadRequestException(
            'the required commission types not send!',
          );
        }
      }

      await this.commissionRepository.update(
        {
          isDeleted: true,
        },
        {
          where: {
            vendorId: vendor.id,
          },
          transaction: transaction,
        },
      );

      for (let index = 0; index < dto.commissions.length; index++) {
        const commission = dto.commissions[index];
        await this.commissionRepository.create(
          {
            vendorId: vendor.id,
            commissionTypeId: 1,
            amount: commission.amount,
            variationPriceId: commission.variationPriceId,
          },
          {
            transaction: transaction,
          },
        );
      }
      if (
        isNotNull(dto.isActive) &&
        item.isActive !== dto.isActive &&
        (item.isActive == false || item.isActive == null) &&
        dto.isActive == true
      ) {
        await this.toggleInventories(item.id, true);
      } else if (
        isNotNull(dto.isActive) &&
        item.isActive !== dto.isActive &&
        item.isActive == true &&
        dto.isActive == false
      ) {
        await this.toggleInventories(item.id, false);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'description',
          'address',
          'priorityOrder',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'isActive',
        ])
        .filter({ id: vendor.id })
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
          {
            model: ECVendorUser,
            as: 'vendorUser',
            where: {
              [Op.and]: [
                {
                  isDefault: true,
                },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorUser.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
          {
            attributes: [
              'id',
              'vendorId',
              'variationPriceId',
              'amount',
              'commissionTypeId',
            ],
            model: ECVendorCommission,
            as: 'commissions',
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
            include: [
              {
                attributes: ['id', 'name'],
                model: ECVariationPrice,
                as: 'variationPrice',
              },
              {
                attributes: ['id', 'name'],
                model: ECVendorCommissionType,
                as: 'commissionType',
              },
            ],
          },
        ])
        .build(),
    );

    return {
      result: vendor,
    };
  }

  async updateV2(entityId: number, dto: VendorV2Dto) {
    // check for item is exists
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.vendor_not_found'),
      );
    }

    // check for if slug exists before
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
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
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.the_given_slug_is_exists_before',
        ),
      );
    }

    const province = await this.provinceRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.provinceId }).build(),
    );

    if (!province) {
      throw new BadRequestException(
        this.localizationService.translate('ecommerce.province_not_found'),
      );
    }

    const city = await this.cityRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.cityId }).build(),
    );

    if (!city) {
      throw new BadRequestException(
        this.localizationService.translate('ecommerce.city_not_found'),
      );
    }

    // find vendor role
    const vendorRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: this.vendorRoleStatic })
        .build(),
    );
    if (!vendorRole) {
      throw new ForbiddenException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    // find default user of this vendor
    let defaultVendorUser = await this.vendorUserRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: User,
            as: 'user',
          },
          {
            model: ECVendor,
            as: 'vendor',
          },
        ])
        .filter({ vendorId: item.id })
        .filter({ isDefault: true })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendorUser.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!defaultVendorUser) {
      throw new ForbiddenException(
        this.localizationService.translate(
          'ecommerce.default_vendor_user_not_found',
        ),
      );
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let vendor: ECVendor = null;
    try {
      if (defaultVendorUser.user.phoneNumber != dto.user.phoneNumber) {
        // remove default user of this vendor
        defaultVendorUser.isDeleted = true;
        defaultVendorUser = await defaultVendorUser.save({
          transaction: transaction,
        });

        // remove vendor role from this old user if is not exists in another vendor
        const existsInAnotherVendor = await this.vendorUserRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ userId: defaultVendorUser.user.id })
            .filter(
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('ECVendorUser.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            )
            .transaction(transaction)
            .build(),
        );
        if (!existsInAnotherVendor) {
          // remove vendor role
          await this.userRoleService.removeRoleFromUser(
            vendorRole,
            defaultVendorUser.user,
            transaction,
          );
        }

        // find user if exists before
        let userVendor = await this.userRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ phoneNumber: dto.user.phoneNumber })
            .transaction(transaction)
            .build(),
        );
        if (!userVendor) {
          // insert user if is not exists before
          const mappedUserItem = this.mapper.map(dto.user, VendorUserDto, User);
          const insertUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
          insertUserItem.username = mappedUserItem.phoneNumber;
          userVendor = await this.userRepository.create(insertUserItem, {
            transaction: transaction,
          });
        }

        // insert vendor role to user
        await this.userRoleService.insertRoleToUser(
          vendorRole,
          userVendor,
          transaction,
        );

        // insert user to this vendor as default
        const vendorUser = await this.vendorUserRepository.create(
          {
            userId: userVendor.id,
            vendorId: item.id,
            isDefault: true,
          },
          {
            transaction: transaction,
          },
        );
      } else {
        const mappedUserItem = this.mapper.map(dto.user, VendorUserDto, User);
        const updateUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
        updateUserItem.username = mappedUserItem.phoneNumber;
        await this.userRepository.update(updateUserItem, {
          where: { id: defaultVendorUser.user.id },
          transaction: transaction,
          returning: true,
        });
      }

      // mapped vendor item
      const mappedItem = this.mapper.map(dto, VendorV2Dto, ECVendor);

      mappedItem.coordinates = Sequelize.fn(
        'geography::STPointFromText',
        `POINT(${dto.longitude} ${dto.latitude})`,
        4326,
      );
      // update vendor item
      vendor = (
        await this.repository.update(_.omit(mappedItem.toJSON(), ['id']), {
          where: {
            id: entityId,
          },
          transaction: transaction,
          returning: true,
        })
      )[1][0];

      const variationPrices = await this.variationPriceRepository.findAll(
        new QueryOptionsBuilder().transaction(transaction).build(),
      );

      if (variationPrices.length > 0) {
        const requiedItems = dto.commissions.filter(
          (commission) =>
            variationPrices.findIndex(
              (variationPrice) =>
                variationPrice.id == commission.variationPriceId,
            ) != -1,
        );
        if (requiedItems.length != variationPrices.length) {
          throw new BadRequestException(
            'the required commission types not send!',
          );
        }
      }

      await this.commissionRepository.update(
        {
          isDeleted: true,
        },
        {
          where: {
            vendorId: vendor.id,
          },
          transaction: transaction,
        },
      );

      for (let index = 0; index < dto.commissions.length; index++) {
        const commission = dto.commissions[index];
        await this.commissionRepository.create(
          {
            vendorId: vendor.id,
            commissionTypeId: 1,
            amount: commission.amount,
            variationPriceId: commission.variationPriceId,
          },
          {
            transaction: transaction,
          },
        );
      }

      if (
        isNotNull(dto.isActive) &&
        item.isActive !== dto.isActive &&
        (item.isActive == false || item.isActive == null) &&
        dto.isActive == true
      ) {
        await this.toggleInventories(item.id, true);
      } else if (
        isNotNull(dto.isActive) &&
        item.isActive !== dto.isActive &&
        item.isActive == true &&
        dto.isActive == false
      ) {
        await this.toggleInventories(item.id, false);
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'description',
          'address',
          'priorityOrder',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'isActive',
        ])
        .filter({ id: vendor.id })
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
          {
            model: ECVendorUser,
            as: 'vendorUser',
            where: {
              [Op.and]: [
                {
                  isDefault: true,
                },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorUser.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
          {
            attributes: [
              'id',
              'vendorId',
              'variationPriceId',
              'amount',
              'commissionTypeId',
            ],
            model: ECVendorCommission,
            as: 'commissions',
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
            include: [
              {
                attributes: ['id', 'name'],
                model: ECVariationPrice,
                as: 'variationPrice',
              },
              {
                attributes: ['id', 'name'],
                model: ECVendorCommissionType,
                as: 'commissionType',
              },
            ],
          },
        ])
        .build(),
    );

    return {
      result: vendor,
    };
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.vendor_not_found'),
      );
    }
    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, [
        'id',
        'name',
        'slug',
        'description',
        'address',
        'priorityOrder',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'isActive',
      ]),
    };
  }

  private async toggleInventories(vendorId: number, activate: boolean) {
    if (activate) {
      await this.vendorQueue.add('active', {
        vendorId: vendorId,
      });
    } else {
      await this.vendorQueue.add('deactive', {
        vendorId: vendorId,
      });
    }
  }

  async findBySlug(slug: string) {
    const vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'description',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'isActive',
        ])
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
          {
            attributes: ['id', 'vendorId', 'logisticId', 'isDefault'],
            model: ECVendorLogistic,
            as: 'vendorLogistic',
            required: false,
            where: {
              [Op.and]: [
                { isDefault: true },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('vendorLogistic.isDeleted'),
                    0,
                  ),
                  { [Op.eq]: 0 },
                ),
              ],
            },
          },
        ])
        .filter({ slug })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!vendor) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.vendor_not_found'),
      );
    }
    return {
      result: vendor,
    };
  }

  async uploadImage(id: number, user: User, file: Express.Multer.File) {
    // find vendor item
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.vendor_not_found'),
      );
    }

    // upload to s3 cloud
    const bucketName = 'vendors';
    await this.minioClientService.createBucket(bucketName);
    const buffer = await this.thumbnailService.resize(file.path);
    const uploadResult = await this.minioClientService.upload(
      bucketName,
      file.filename,
      buffer,
      {
        'Content-Type': file.mimetype,
      },
    );

    // remove old one if exists
    if (item.attachmentId) {
      let oldAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: item.attachmentId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .filter({ attachmentTypeId: this.vendorAttachmentType })
          .build(),
      );
      if (oldAttachment) {
        // remove from s3 cloud
        await this.minioClientService.remove(
          oldAttachment.bucketName,
          oldAttachment.fileName,
        );

        // remove in database
        oldAttachment.isDeleted = true;
        oldAttachment = await oldAttachment.save();
      }
    }

    // create new one
    const newAttachment = await this.attachmentRepository.create({
      attachmentTypeId: this.vendorAttachmentType,
      fileName: file.filename,
      originalFileName: file.originalname,
      mimetype: file.mimetype,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
      bucketName: bucketName,
      userId: user.id,
    });
    item.attachmentId = newAttachment.id;
    item = await item.save();

    // remove file on current instanse
    fs.rmSync(file.path);

    return {
      result: _.pick(newAttachment, ['id', 'fileName']),
    };
  }

  private async upsertVendorLogistic(
    dto: VendorDto,
    vendor: ECVendor,
    transaction: Transaction,
  ) {
    const defaultVendorLogisticCondition = {
      [Op.and]: [
        { vendorId: vendor.id },
        { isDefault: true },
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECVendorLogistic.isDeleted'),
            0,
          ),
          { [Op.eq]: 0 },
        ),
      ],
    };

    const markDefaultAsDeleted = async () => {
      await this.vendorLogisticRepository.update(
        { isDeleted: true },
        { where: defaultVendorLogisticCondition, transaction },
      );
    };

    if (isNotNull(dto.logisticId)) {
      const vendorLogistic = await this.vendorLogisticRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ vendorId: vendor.id })
          .filter({ isDefault: true })
          .filter(defaultVendorLogisticCondition[Op.and][2])
          .transaction(transaction)
          .build(),
      );

      if (!vendorLogistic || vendorLogistic.logisticId !== dto.logisticId) {
        await this.vendorLogisticRepository.create(
          { vendorId: vendor.id, logisticId: dto.logisticId, isDefault: true },
          { transaction },
        );
      } else {
        await markDefaultAsDeleted();
      }
    } else {
      await markDefaultAsDeleted();
    }
  }
}
