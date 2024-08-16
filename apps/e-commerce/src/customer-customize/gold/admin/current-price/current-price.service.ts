import { Injectable } from '@nestjs/common';
import { CurrentPriceDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';
import { Setting } from '@rahino/database/models/core/setting.entity';

@Injectable()
export class CurrentPriceService {
  private readonly GOLD_CURRENT_PRICE = 'GOLD_CURRENT_PRICE';
  private readonly GOLD_CURRENT_PRICE_JOB_STATUS =
    'GOLD_CURRENT_PRICE_JOB_STATUS';
  constructor(@InjectModel(Setting) private repository: typeof Setting) {}

  async findOne() {
    const currentPrice = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_CURRENT_PRICE,
        })
        .build(),
    );
    const currentPriceJobStatus = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_CURRENT_PRICE_JOB_STATUS,
        })
        .build(),
    );

    return {
      result: {
        currentPrice: Number(currentPrice.value),
        currentPriceJobStatus:
          currentPriceJobStatus.value == 'true' ? true : false,
      },
    };
  }

  async update(dto: CurrentPriceDto, user: User) {
    let currentPrice = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_CURRENT_PRICE,
        })
        .build(),
    );
    currentPrice.value = dto.currentPrice.toString();
    currentPrice = await currentPrice.save();

    let currentPriceJobStatus = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_CURRENT_PRICE_JOB_STATUS,
        })
        .build(),
    );
    currentPriceJobStatus.value = dto.currentPriceJobStatus ? 'true' : 'false';
    currentPriceJobStatus = await currentPriceJobStatus.save();
    return {
      result: 'ok',
    };
  }
}
