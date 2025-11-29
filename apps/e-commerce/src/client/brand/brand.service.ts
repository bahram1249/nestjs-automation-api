import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BrandDto, GetBrandDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECBrand } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { MinioClientService } from '@rahino/minio-client';
import * as fs from 'fs';
import { Attachment } from '@rahino/database';
import { Response } from 'express';
import { ThumbnailService } from '@rahino/thumbnail';

@Injectable()
export class BrandService {
  private brandAttachmentType = 6;
  constructor(
    private minioClientService: MinioClientService,
    @InjectModel(ECBrand) private repository: typeof ECBrand,
    @InjectModel(Attachment) private attachmentRepository: typeof Attachment,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async findAll(filter: GetBrandDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECBrand.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    if (filter.entityTypeId) {
      queryBuilder = queryBuilder.filter(
        Sequelize.literal(`EXISTS (
        SELECT 1
        FROM ECProducts ECP
        WHERE ECP.entityTypeId = ${filter.entityTypeId}
          AND ISNULL(ECP.isDeleted, 0) = 0
          AND ECP.brandId = ECBrand.id
      )`),
      );
    }
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes([
        'id',
        'name',
        'slug',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'priority',
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
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: number) {
    const brand = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'description',
          'priority',
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
        ])
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECBrand.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!brand) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: brand,
    };
  }

  async create(dto: BrandDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECBrand.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (item) {
      throw new BadRequestException(
        'the item with this slug is exists before !',
      );
    }

    const mappedItem = this.mapper.map(dto, BrandDto, ECBrand);
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    return {
      result: _.pick(result, [
        'id',
        'name',
        'slug',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'createdAt',
        'updatedAt',
      ]),
    };
  }

  async update(entityId: number, dto: BrandDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECBrand.isDeleted'), 0),
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
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter({
          id: {
            [Op.ne]: entityId,
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECBrand.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        'the item with this slug is exists before !',
      );
    }
    const mappedItem = this.mapper.map(dto, BrandDto, ECBrand);
    const result = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: {
          id: entityId,
        },
        returning: true,
      },
    );
    return {
      result: _.pick(result[1][0], [
        'id',
        'name',
        'slug',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'createdAt',
        'updatedAt',
      ]),
    };
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECBrand.isDeleted'), 0),
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
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'createdAt',
        'updatedAt',
      ]),
    };
  }

  async findBySlug(slug: string) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'description',
          'priority',
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
        ])
        .filter({ slug: slug })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECBrand.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given slug not founded!');
    }
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

    // upload to s3 cloud
    const bucketName = 'brands';
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
          .filter({ attachmentTypeId: this.brandAttachmentType })
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
      attachmentTypeId: this.brandAttachmentType,
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

    // remove file on current instance
    fs.rmSync(file.path);

    return {
      result: _.pick(newAttachment, ['id', 'fileName']),
    };
  }

  async getPhoto(res: Response, fileName: string) {
    const attachment = await this.attachmentRepository.findOne(
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
        .filter({ attachmentTypeId: this.brandAttachmentType })
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
