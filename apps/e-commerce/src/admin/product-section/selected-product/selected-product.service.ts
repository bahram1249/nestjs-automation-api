import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SelectedProductDto, GetSelectedProductDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
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
import { ECSelectedProduct } from '@rahino/localdatabase/models';
import { ECSelectedProductType } from '@rahino/localdatabase/models';

@Injectable()
export class SelectedProductService {
  private selectedProductAttachmentType = 16;
  constructor(
    private minioClientService: MinioClientService,
    @InjectModel(ECSelectedProduct)
    private repository: typeof ECSelectedProduct,
    @InjectModel(Attachment) private attachmentRepository: typeof Attachment,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async findAll(filter: GetSelectedProductDto) {
    let queryBuilder = new QueryOptionsBuilder().filter({
      title: {
        [Op.like]: filter.search,
      },
    });
    if (filter.selecetedProductTypeId) {
      queryBuilder = queryBuilder.filter({
        selectedProductTypeId: filter.selecetedProductTypeId,
      });
    }
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes([
        'id',
        'title',
        'slug',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'priority',
        'selectedProductTypeId',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'title'],
          model: ECSelectedProductType,
          as: 'selectedProductType',
          required: false,
        },
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECSelectedProduct.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
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
    const selectedProduct = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'title',
          'slug',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
          'description',
          'priority',
          'selectedProductTypeId',
          'createdAt',
          'updatedAt',
        ])
        .include([
          {
            attributes: ['id', 'title'],
            model: ECSelectedProductType,
            as: 'selectedProductType',
            required: false,
          },
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECSelectedProduct.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: entityId })
        .build(),
    );
    if (!selectedProduct) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: selectedProduct,
    };
  }

  async create(dto: SelectedProductDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECSelectedProduct.isDeleted'),
              0,
            ),
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

    const mappedItem = this.mapper.map(
      dto,
      SelectedProductDto,
      ECSelectedProduct,
    );
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    return {
      result: _.pick(result, [
        'id',
        'title',
        'slug',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'selectedProductTypeId',
        'createdAt',
        'updatedAt',
      ]),
    };
  }

  async update(entityId: number, dto: SelectedProductDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECSelectedProduct.isDeleted'),
              0,
            ),
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
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECSelectedProduct.isDeleted'),
              0,
            ),
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
    const mappedItem = this.mapper.map(
      dto,
      SelectedProductDto,
      ECSelectedProduct,
    );
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
        'title',
        'slug',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'selectedProductTypeId',
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
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECSelectedProduct.isDeleted'),
              0,
            ),
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
        'title',
        'slug',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'selectedProductTypeId',
        'createdAt',
        'updatedAt',
      ]),
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
    const bucketName = 'selectedproducts';
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
          .filter({ attachmentTypeId: this.selectedProductAttachmentType })
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
      attachmentTypeId: this.selectedProductAttachmentType,
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
        .filter({ attachmentTypeId: this.selectedProductAttachmentType })
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
