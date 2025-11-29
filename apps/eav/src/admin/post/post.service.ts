import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize, Transaction } from 'sequelize';
import { PostDto, GetPostDto, PhotoDto } from './dto';
import {
  EAVPost,
  EAVBlogPublish,
  EAVEntityType,
  EAVEntityPhoto,
} from '@rahino/localdatabase/models';
import { User, Attachment } from '@rahino/database';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { EntityService } from '../entity/entity.service';
import { MinioClientService } from '@rahino/minio-client';
import { ThumbnailService } from '@rahino/thumbnail';
import * as fs from 'fs';
import { PostAttachmentDto } from './dto/post-attachment.dto';

@Injectable()
export class PostService {
  private photoTempAttachmentType = 16;
  private postAttachmentType = 17;
  constructor(
    @InjectModel(EAVPost)
    private readonly repository: typeof EAVPost,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectModel(EAVEntityPhoto)
    private readonly entityPhotoRepository: typeof EAVEntityPhoto,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly i18n: I18nService<I18nTranslations>,
    private readonly entityService: EntityService,
    private readonly minioClientService: MinioClientService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async findAll(filter: GetPostDto) {
    let builder = new QueryOptionsBuilder();
    builder = builder
      .filter({
        [Op.or]: [
          {
            title: {
              [Op.like]: filter.search,
            },
          },
          {
            slug: {
              [Op.like]: filter.search,
            },
          },
        ],
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(builder.build());
    builder = builder
      .attributes([
        'id',
        'entityTypeId',
        'publishId',
        'title',
        'slug',
        'description',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ])
      .include([
        {
          model: EAVEntityType,
          as: 'entityType',
          required: false,
        },
        {
          model: EAVBlogPublish,
          as: 'publish',
        },
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachments',
          required: false,
          through: {
            attributes: [],
          },
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(builder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findById(id: bigint) {
    const builder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'entityTypeId',
        'publishId',
        'title',
        'slug',
        'description',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ])
      .include([
        {
          model: EAVEntityType,
          as: 'entityType',
          required: false,
        },
        {
          model: EAVBlogPublish,
          as: 'publish',
        },
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachments',
          required: false,
          through: {
            attributes: [],
          },
        },
      ])
      .filter({
        id: id,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const blog = await this.repository.findOne(builder.build());
    if (!blog) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    return {
      result: blog,
    };
  }

  async create(dto: PostDto) {
    const slugSearch = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ slug: dto.slug })
        .build(),
    );
    if (slugSearch) {
      throw new ForbiddenException(
        this.i18n.t('core.the_given_slug_is_exists_before', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    // validation of entityType is linked to blog model
    const blogEntityModel = 2;
    const entityType = await this.entityTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.entityTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          entityModelId: blogEntityModel,
        })
        .build(),
    );
    if (!entityType) {
      throw new BadRequestException(
        `the given entityType->${dto.entityTypeId} isn't exists`,
      );
    }

    // validation of photos
    const mappedPhotos = _.map(dto.postAttachments, (photo) =>
      this.mapper.map(photo, PostAttachmentDto, PhotoDto),
    );
    await this.validationExistsPhoto(mappedPhotos);

    // begin transaction
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let post: EAVPost = null;
    try {
      const mappedItem = this.mapper.map(dto, PostDto, EAVPost);
      const insertItem = _.omit(mappedItem.toJSON(), ['id']);
      const { result } = await this.entityService.create(
        {
          entityTypeId: mappedItem.entityTypeId,
        },
        transaction,
      );
      insertItem.id = result.entityId;

      post = await this.repository.create(insertItem, {
        transaction: transaction,
      });

      // remove photos
      await this.removePhotosByPostId(post.id, transaction);

      // insert product photos
      await this.insertPhotos(post.id, mappedPhotos, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }

    return await this.findById(post.id);
  }

  async updateById(id: bigint, dto: PostDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ slug: dto.slug })
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        this.i18n.t('core.the_given_slug_is_exists_before', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    // validation of entityType is linked to blog model
    const blogEntityModel = 2;
    const entityType = await this.entityTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.entityTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          entityModelId: blogEntityModel,
        })
        .build(),
    );
    if (!entityType) {
      throw new BadRequestException(
        `the given entityType->${dto.entityTypeId} isn't exists`,
      );
    }

    // validation of photos
    const mappedPhotos = _.map(dto.postAttachments, (photo) =>
      this.mapper.map(photo, PostAttachmentDto, PhotoDto),
    );
    await this.validationExistsPhoto(mappedPhotos);

    // begin transaction
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let post: EAVPost = null;
    try {
      const mappedItem = this.mapper.map(dto, PostDto, EAVPost);
      const updated = await this.repository.update(
        _.omit(mappedItem.toJSON(), ['id']),
        {
          where: { id },
          returning: true,
          transaction: transaction,
        },
      );
      post = updated[1][0];

      // remove photos
      await this.removePhotosByPostId(post.id, transaction);

      // insert product photos
      await this.insertPhotos(post.id, mappedPhotos, transaction);

      await transaction.commit();
    } catch (error) {
      transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }

    return await this.findById(post.id);
  }

  async deleteById(postId: bigint) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: postId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVPost.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    item.isDeleted = true;
    item = await item.save();
    return {
      result: _.pick(item, [
        'id',
        'entityTypeId',
        'publishId',
        'title',
        'slug',
        'description',
        'metaTitle',
        'metaDescription',
        'metaKeywords',
      ]),
    };
  }

  async uploadImage(user: User, file: Express.Multer.File) {
    // upload to s3 cloud
    const bucketName = 'blogphotos';
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

    // create new one
    const newAttachment = await this.attachmentRepository.create({
      attachmentTypeId: this.photoTempAttachmentType,
      fileName: file.filename,
      originalFileName: file.originalname,
      mimetype: file.mimetype,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
      bucketName: bucketName,
      userId: user.id,
    });

    // remove file on current instanse
    fs.rmSync(file.path);

    return {
      result: _.pick(newAttachment, ['id', 'fileName']),
    };
  }

  private async validationExistsPhoto(mappedPhotos: PhotoDto[]) {
    for (const photo of mappedPhotos) {
      const findAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: photo.id })
          .filter({
            attachmentTypeId: {
              [Op.in]: [this.photoTempAttachmentType, this.postAttachmentType],
            },
          })
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
      if (!findAttachment) {
        throw new BadRequestException(
          `the given product photo->${photo.id} isn't exists !`,
        );
      }
    }
  }

  private async insertPhotos(
    id: bigint,
    mappedPhotos: PhotoDto[],
    transaction: Transaction,
  ) {
    for (const photo of mappedPhotos) {
      let findAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: photo.id })
          .filter({
            attachmentTypeId: {
              [Op.in]: [this.photoTempAttachmentType, this.postAttachmentType],
            },
          })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .transaction(transaction)
          .build(),
      );
      findAttachment.attachmentTypeId = this.postAttachmentType;
      findAttachment = await findAttachment.save({ transaction: transaction });
      await this.entityPhotoRepository.create(
        {
          entityId: id,
          attachmentId: findAttachment.id,
        },
        {
          transaction: transaction,
        },
      );
    }
  }

  private async removePhotosByPostId(id: bigint, transaction: Transaction) {
    await this.entityPhotoRepository.destroy({
      where: {
        entityId: id,
      },
      transaction: transaction,
    });
  }
}
