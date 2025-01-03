import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { Setting } from '@rahino/database';

@Injectable()
export class HeaderNotificationService {
  private readonly HEADER_NOTIFICATION_TEXT = 'HEADER_NOTIFICATION_TEXT';
  private readonly HEADER_NOTIFICATION_TEXT_COLOR =
    'HEADER_NOTIFICATION_TEXT_COLOR';
  private readonly HEADER_NOTIFICATION_BACKGROUND_COLOR =
    'HEADER_NOTIFICATION_BACKGROUND_COLOR';
  constructor(@InjectModel(Setting) private repository: typeof Setting) {}

  async findOne() {
    const notificationText = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.HEADER_NOTIFICATION_TEXT,
        })
        .build(),
    );
    const notificationTextColor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.HEADER_NOTIFICATION_TEXT_COLOR,
        })
        .build(),
    );
    const notificationBackgroundColor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.HEADER_NOTIFICATION_BACKGROUND_COLOR,
        })
        .build(),
    );
    return {
      result: {
        message: notificationText.value,
        textColor: notificationTextColor.value,
        backgroundColor: notificationBackgroundColor.value,
      },
    };
  }
}
