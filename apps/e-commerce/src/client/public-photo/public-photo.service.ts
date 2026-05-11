import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { MinioClientService } from '@rahino/minio-client';
import { Attachment } from '@rahino/database';
import { Response } from 'express';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class PublicPhotoService {
  private publicPhotoAttachmentType = 26;
  constructor(
    private minioClientService: MinioClientService,
    @InjectModel(Attachment)
    private attachmentRepository: typeof Attachment,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async getPhoto(res: Response, fileName: string) {
    const photoTypes = [this.publicPhotoAttachmentType];
    const attachment = await this.attachmentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ fileName: fileName })
        .filter(this.seqHelp.whereIsNullColumnEqualToZero('isDeleted', 0))
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
}
