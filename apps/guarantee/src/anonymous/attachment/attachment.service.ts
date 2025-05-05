import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { Attachment } from '@rahino/database';
import { MinioClientService } from '@rahino/minio-client';
import { ThumbnailService } from '@rahino/thumbnail';
import * as fs from 'fs';
import { GSAttachmentTypeEnum } from '@rahino/guarantee/shared/gs-attachment-type';
@Injectable()
export class AttachmentService {
  private photoTempAttachmentType = GSAttachmentTypeEnum.TempOrganization;
  constructor(
    private readonly minioClientService: MinioClientService,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  async uploadImage(file: Express.Multer.File) {
    // upload to s3 cloud
    const bucketName = 'organizations';
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
    });

    // remove file on current instanse
    fs.rmSync(file.path);

    return {
      result: _.pick(newAttachment, ['id', 'fileName']),
    };
  }
}
