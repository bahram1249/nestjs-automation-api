import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VendorDto, GetVendorDto, VendorUserDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Role } from '@rahino/database/models/core/role.entity';
import { UserRoleService } from '@rahino/core/admin/user-role/user-role.service';
import { ECVendorUser } from '@rahino/database/models/ecommerce-eav/ec-vendor-user.entity';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { MinioClientService } from '@rahino/minio-client';
import * as fs from 'fs';
import { ThumbnailService } from '@rahino/thumbnail';
import { ECVendorCommission } from '@rahino/database/models/ecommerce-eav/ec-vendor-commision.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ECVendorCommissionType } from '@rahino/database/models/ecommerce-eav/ec-vendor-commission-type.entity';

@Injectable()
export class VendorService {
  private vendorAttachmentType = 11;
  constructor(
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
  ) {}

  async findAll(filter: GetVendorDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .filter({
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
      throw new NotFoundException('the item with this given id not founded!');
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
        'the item with this given slug is exists before!',
      );
    }

    // find vendor role
    const vendorRoleStatic = 2;
    const vendorRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder().filter({ static_id: vendorRoleStatic }).build(),
    );
    if (!vendorRole) {
      throw new ForbiddenException('the vendor role not founded!');
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
      throw new NotFoundException('the item with this given id not founded!');
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
        'the item with this given slug is exists before!',
      );
    }

    // find vendor role
    const vendorRoleStatic = 2;
    const vendorRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder().filter({ static_id: vendorRoleStatic }).build(),
    );
    if (!vendorRole) {
      throw new ForbiddenException('the vendor role not founded!');
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
        'default user of this vendor is not founded!',
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
      throw new NotFoundException('the item with this given id not founded!');
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
      ]),
    };
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
        ])
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
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
      throw new NotFoundException('the item with this given id not founded!');
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
      throw new NotFoundException('the item with this given id not founded!');
    }

    // upload to s3 cloud
    const bucketName = 'vendors';
    await this.minioClientService.createBucket(bucketName);
    const buffer = await this.thumbnailService.resize(file.path);
    const uploadResult = await this.minioClientService.upload(
      bucketName,
      file.filename,
      buffer,
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
}
