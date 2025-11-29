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
import { VideoDto } from './dto';
import { EAVEntityVideo } from '@rahino/localdatabase/models';
import * as util from 'util';
const readFileAsync = util.promisify(fs.readFile);

@Injectable()
export class ProductVideoService {
  private videoTempAttachmentType = 14;
  private videoProductAttachmentType = 15;
  constructor(
    private minioClientService: MinioClientService,
    @InjectModel(Attachment)
    private attachmentRepository: typeof Attachment,
    @InjectModel(EAVEntityVideo)
    private readonly entityVideoRepository: typeof EAVEntityVideo,
  ) {}

  async uploadVideo(user: User, file: Express.Multer.File) {
    // upload to s3 cloud
    const bucketName = 'productvideos';
    await this.minioClientService.createBucket(bucketName);
    const buffer = await readFileAsync(file.path);
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
      attachmentTypeId: this.videoTempAttachmentType,
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

  async getVideo(res: Response, fileName: string) {
    const photoTypes = [
      this.videoTempAttachmentType,
      this.videoProductAttachmentType,
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

  async validationExistsVideo(videos?: VideoDto[]) {
    for (const video of videos) {
      const findAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: video.id })
          .filter({
            attachmentTypeId: {
              [Op.in]: [
                this.videoTempAttachmentType,
                this.videoProductAttachmentType,
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
          `the given product video->${video.id} isn't exists !`,
        );
      }
    }
  }

  async insert(
    productId: bigint,
    videos?: VideoDto[],
    transaction?: Transaction,
  ) {
    for (const video of videos) {
      let findAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: video.id })
          .filter({
            attachmentTypeId: {
              [Op.in]: [
                this.videoTempAttachmentType,
                this.videoProductAttachmentType,
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
      findAttachment.attachmentTypeId = this.videoProductAttachmentType;
      findAttachment = await findAttachment.save({ transaction: transaction });
      await this.entityVideoRepository.create(
        {
          entityId: productId,
          attachmentId: findAttachment.id,
        },
        {
          transaction: transaction,
        },
      );
    }
  }

  async removeVideosByProductId(productId: bigint, transaction?: Transaction) {
    await this.entityVideoRepository.destroy({
      where: {
        entityId: productId,
      },
      transaction: transaction,
    });
  }
}
