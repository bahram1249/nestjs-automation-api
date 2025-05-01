import { Injectable } from '@nestjs/common';
import { GSRequestAttachmentDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSRequestAttachment,
  GSRequestAttachmentType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

import * as _ from 'lodash';
import { Attachment, User } from '@rahino/database';
import { MinioClientService } from '@rahino/minio-client';
import { ThumbnailService } from '@rahino/thumbnail';
import * as fs from 'fs';

@Injectable()
export class RequestAttachmentService {
  private photoTempAttachmentType = 19;
  constructor(
    @InjectModel(GSRequestAttachment)
    private readonly repository: typeof GSRequestAttachment,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    private readonly minioClientService: MinioClientService,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async findAll(requestId: bigint, filter: GSRequestAttachmentDto) {
    let query = new QueryOptionsBuilder().filter({
      requestId: requestId,
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'requestId',
        'requestAttachmentTypeId',
        'attachmentId',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: true,
        },
      ])
      .thenInclude({
        attributes: ['id', 'title'],
        model: GSRequestAttachmentType,
        as: 'requestAttachmentType',
      })
      .thenInclude({
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
      })
      .filter({ requestId: requestId })
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async uploadImage(user: User, file: Express.Multer.File) {
    // upload to s3 cloud
    const bucketName = 'requests';
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
}
