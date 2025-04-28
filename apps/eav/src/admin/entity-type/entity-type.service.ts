import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { EntityTypeDto, GetEntityTypeDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVEntityModel } from '@rahino/localdatabase/models';
import * as _ from 'lodash';
import { Attachment } from '@rahino/database';
import { MinioClientService } from '@rahino/minio-client';
import { Response } from 'express';
import { User } from '@rahino/database';
import * as fs from 'fs';
import { ThumbnailService } from '@rahino/thumbnail';

@Injectable()
export class EntityTypeService {
  private entityTypeAttachmentType = 8;
  constructor(
    @InjectModel(EAVEntityType)
    private readonly repository: typeof EAVEntityType,
    @InjectModel(EAVEntityModel)
    private readonly entityModelRepository: typeof EAVEntityModel,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    private minioClientService: MinioClientService,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async findAll(filter: GetEntityTypeDto) {
    let builder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    if (filter.entityModelId) {
      builder = builder.filter({
        entityModelId: filter.entityModelId,
      });
    }
    if (filter.parentEntityTypeId) {
      builder = builder.filter({
        parentEntityTypeId: filter.parentEntityTypeId,
      });
    }
    if (filter.ignoreChilds) {
      builder = builder.filter({
        parentEntityTypeId: {
          [Op.is]: null,
        },
      });
    }
    const count = await this.repository.count(builder.build());
    builder = builder
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
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
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'subEntityTypes',
          required: false,
          where: Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('subEntityTypes.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
          include: [
            {
              attributes: ['id', 'name', 'slug'],
              model: EAVEntityType,
              as: 'subEntityTypes',
              required: false,
              where: Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('subEntityTypes.subEntityTypes.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
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
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'priority',
        'showLanding',
        'createdAt',
        'updatedAt',
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const options = builder.build();
    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    const builder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'showLanding',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
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
      ])
      .filter({ id })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const result = await this.repository.findOne(builder.build());
    return {
      result: result,
    };
  }

  async findByIdAnyway(id: number) {
    const builder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'showLanding',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
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
      ])
      .filter({ id });

    const result = await this.repository.findOne(builder.build());
    return {
      result: result,
    };
  }

  async findBySlug(slug: string) {
    const builder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'showLanding',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
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
      ])
      .filter({ slug: slug })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException(
        'the item with this given slug is not founded!',
      );
    }
    return {
      result: result,
    };
  }

  async create(dto: EntityTypeDto) {
    const entityModel = await this.entityModelRepository.findOne({
      where: {
        id: dto.entityModelId,
      },
    });
    if (!entityModel) {
      throw new ForbiddenException('the given entityModelId not founded!');
    }

    if (dto.parentEntityTypeId) {
      const entityTypeParent = await this.repository.findOne({
        where: {
          id: dto.parentEntityTypeId,
          entityModelId: dto.entityModelId,
        },
      });
      if (!entityTypeParent) {
        throw new ForbiddenException(
          'the given parentEntityTypeId not founded!',
        );
      }
    }
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
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
    const mappedItem = this.mapper.map(dto, EntityTypeDto, EAVEntityType);
    let entityType = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    let builder = new QueryOptionsBuilder();
    const options = builder
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'showLanding',
        'createdAt',
        'updatedAt',
      ])
      .filter({ id: entityType.id })
      .include([
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
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
      ])
      .build();

    return {
      result: await this.repository.findOne(options),
    };
  }

  async update(id: number, dto: EntityTypeDto) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
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

    const entityModel = await this.entityModelRepository.findOne({
      where: {
        id: dto.entityModelId,
      },
    });
    if (!entityModel) {
      throw new ForbiddenException('the given entityModelId not founded!');
    }

    if (dto.parentEntityTypeId) {
      const entityTypeParent = await this.repository.findOne({
        where: {
          id: dto.parentEntityTypeId,
          entityModelId: dto.entityModelId,
        },
      });
      if (!entityTypeParent) {
        throw new ForbiddenException(
          'the given parentEntityTypeId not founded!',
        );
      }
    }

    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
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

    const mappedItem = this.mapper.map(dto, EntityTypeDto, EAVEntityType);
    let entityType = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: { id },
        returning: true,
      },
    );
    let builder = new QueryOptionsBuilder();
    const options = builder
      .filter({ id: entityType[1][0].id })
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
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
      ])
      .build();
    return {
      result: await this.repository.findOne(options),
    };
  }

  async deleteById(id: number) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
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
    item = await item.save();
    return {
      result: item,
    };
  }

  async uploadImage(id: number, user: User, file: Express.Multer.File) {
    // find brand item
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
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
    const bucketName = 'entitytypes';
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
          .filter({ attachmentTypeId: this.entityTypeAttachmentType })
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
      attachmentTypeId: this.entityTypeAttachmentType,
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

  async getPhoto(res: Response, fileName: string) {
    let attachment = await this.attachmentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ fileName: fileName })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ attachmentTypeId: this.entityTypeAttachmentType })
        .build(),
    );
    if (!attachment) {
      throw new ForbiddenException("You don't have access to this file!");
    }
    const accessUrl = await this.minioClientService.generateDownloadUrl(
      attachment.bucketName,
      attachment.fileName,
    );
    return {
      result: accessUrl,
    };
  }
}
