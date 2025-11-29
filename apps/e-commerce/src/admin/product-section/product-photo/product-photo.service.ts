import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { MinioClientService } from '@rahino/minio-client';
import * as fs from 'fs';
import { Attachment } from '@rahino/database';
import { Response } from 'express';
import { PhotoDto } from './dto';
import { EAVEntityPhoto } from '@rahino/localdatabase/models';
import { ThumbnailService } from '@rahino/thumbnail';

@Injectable()
export class ProductPhotoService {
  private photoTempAttachmentType = 9;
  private productAttachmentType = 10;
  constructor(
    private minioClientService: MinioClientService,
    @InjectModel(Attachment)
    private attachmentRepository: typeof Attachment,
    @InjectModel(EAVEntityPhoto)
    private readonly entityPhotoRepository: typeof EAVEntityPhoto,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async uploadImage(user: User, file: Express.Multer.File) {
    // upload to s3 cloud
    const bucketName = 'products';
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

  async getPhoto(res: Response, fileName: string) {
    const photoTypes = [
      this.photoTempAttachmentType,
      this.productAttachmentType,
    ];
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
        .filter({
          attachmentTypeId: {
            [Op.in]: photoTypes,
          },
        })
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

  async validationExistsPhoto(photos?: PhotoDto[]) {
    for (const photo of photos) {
      const findAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: photo.id })
          .filter({
            attachmentTypeId: {
              [Op.in]: [
                this.photoTempAttachmentType,
                this.productAttachmentType,
              ],
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

  async insert(
    productId: bigint,
    photos?: PhotoDto[],
    transaction?: Transaction,
  ) {
    let priority = 1;
    for (const photo of photos) {
      let findAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: photo.id })
          .filter({
            attachmentTypeId: {
              [Op.in]: [
                this.photoTempAttachmentType,
                this.productAttachmentType,
              ],
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
      findAttachment.attachmentTypeId = this.productAttachmentType;
      findAttachment = await findAttachment.save({ transaction: transaction });
      await this.entityPhotoRepository.create(
        {
          entityId: productId,
          attachmentId: findAttachment.id,
          priority: priority,
        },
        {
          transaction: transaction,
        },
      );
      priority++;
    }
  }

  async removePhotosByProductId(productId: bigint, transaction?: Transaction) {
    await this.entityPhotoRepository.destroy({
      where: {
        entityId: productId,
      },
      transaction: transaction,
    });
  }
}
