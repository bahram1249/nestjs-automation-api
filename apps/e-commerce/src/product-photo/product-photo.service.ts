import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';
import { MinioClientService } from '@rahino/minio-client';
import * as fs from 'fs';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { Response } from 'express';
import { PhotoDto } from './dto';
import { EAVEntityPhoto } from '@rahino/database/models/eav/eav-entity-photo.entity';

@Injectable()
export class ProductPhotoService {
  private photoTempAttachmentType = 9;
  private productAttachmentType = 10;
  constructor(
    private minioClientService: MinioClientService,
    @InjectModel(Attachment)
    private attachmentRepository: typeof Attachment,
    @InjectModel(EAVEntityPhoto)
    private entityPhotoRepository: typeof EAVEntityPhoto,
  ) {}

  async uploadImage(user: User, file: Express.Multer.File) {
    // upload to s3 cloud
    const bucketName = 'products';
    await this.minioClientService.createBucket(bucketName);
    const fileStream = fs.readFileSync(file.path);
    const uploadResult = await this.minioClientService.upload(
      bucketName,
      file.filename,
      fileStream,
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
    photos.forEach(async (photo) => {
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
    });
  }

  async insert(productId: bigint, photos?: PhotoDto[]) {
    photos.forEach(async (photo) => {
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
          .build(),
      );
      findAttachment.attachmentTypeId = this.productAttachmentType;
      findAttachment = await findAttachment.save();
      await this.entityPhotoRepository.create({
        entityId: productId,
        attachmentId: findAttachment.id,
      });
    });
  }
}
