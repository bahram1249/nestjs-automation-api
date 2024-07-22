import { ForbiddenException, Injectable, StreamableFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';
import { MinioClientService } from '@rahino/minio-client';
import * as fs from 'fs';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { Response } from 'express';
import axios from 'axios';

@Injectable()
export class HomePagePhotoService {
  private homePageAttachmentType = 13;
  constructor(
    private minioClientService: MinioClientService,
    @InjectModel(Attachment)
    private attachmentRepository: typeof Attachment, //private readonly thumbnailService: ThumbnailService,
  ) {}

  async uploadImage(user: User, file: Express.Multer.File) {
    // upload to s3 cloud
    const bucketName = 'homepages';
    await this.minioClientService.createBucket(bucketName);
    //const buffer = await this.thumbnailService.resize(file.path);
    const buffer = fs.readFileSync(file.path);
    const uploadResult = await this.minioClientService.upload(
      bucketName,
      file.filename,
      buffer,
    );

    // create new one
    const newAttachment = await this.attachmentRepository.create({
      attachmentTypeId: this.homePageAttachmentType,
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

  async getPhoto(id: bigint, res: Response): Promise<StreamableFile> {
    const photoTypes = [this.homePageAttachmentType];
    let attachment = await this.attachmentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
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

    res.set({
      'Content-Type': attachment.mimetype,
    });

    const response = await axios.get(accessUrl, { responseType: 'stream' });
    const stream = response.data;

    return new StreamableFile(stream);
  }
}
