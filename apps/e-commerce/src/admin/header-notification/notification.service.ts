import { Injectable, NotFoundException } from '@nestjs/common';
import { HeaderNotificationDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';
import { Setting } from '@rahino/database/models/core/setting.entity';

@Injectable()
export class HeaderNotificationService {
  private readonly HEADER_NOTIFICATION_TEXT = 'HEADER_NOTIFICATION_TEXT';
  constructor(@InjectModel(Setting) private repository: typeof Setting) {}

  async findOne() {
    let queryBuilder = new QueryOptionsBuilder().filter({
      key: this.HEADER_NOTIFICATION_TEXT,
    });
    const result = await this.repository.findOne(queryBuilder.build());
    return {
      result: result.value,
    };
  }

  async update(dto: HeaderNotificationDto, user: User) {
    let queryBuilder = new QueryOptionsBuilder().filter({
      key: this.HEADER_NOTIFICATION_TEXT,
    });
    let result = await this.repository.findOne(queryBuilder.build());
    result.value = dto.message;
    result = await result.save();
    return {
      result: 'ok',
    };
  }
}
