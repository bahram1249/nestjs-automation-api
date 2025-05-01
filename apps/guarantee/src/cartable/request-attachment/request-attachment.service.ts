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

@Injectable()
export class RequestAttachmentService {
  constructor(
    @InjectModel(GSRequestAttachment)
    private readonly repository: typeof GSRequestAttachment,
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
}
