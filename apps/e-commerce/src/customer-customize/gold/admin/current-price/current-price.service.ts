import { Injectable } from '@nestjs/common';
import { CurrentPriceDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { Setting } from '@rahino/database';

@Injectable()
export class CurrentPriceService {
  private readonly GOLD_CURRENT_PRICE = 'GOLD_CURRENT_PRICE';
  private readonly GOLD_CURRENT_PRICE_JOB_STATUS =
    'GOLD_CURRENT_PRICE_JOB_STATUS';
  private readonly GOLD_STATIC_PROFIT = 'GOLD_STATIC_PROFIT';
  private readonly GOLD_PROFIT = 'GOLD_PROFIT';
  private readonly GOLD_TAX = 'GOLD_TAX';
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

    const goldStaticProfit = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_STATIC_PROFIT,
        })
        .build(),
    );

    const goldProfit = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_PROFIT,
        })
        .build(),
    );

    const goldTax = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_TAX,
        })
        .build(),
    );

    return {
      result: {
        currentPrice: Number(currentPrice.value),
        currentPriceJobStatus:
          currentPriceJobStatus.value == 'true' ? true : false,
        goldStaticProfit: Number(goldStaticProfit.value),
        goldProfit: Number(goldProfit.value),
        goldTax: Number(goldTax.value),
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

    let goldStaticProfit = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_STATIC_PROFIT,
        })
        .build(),
    );
    goldStaticProfit.value = dto.goldStaticProfit.toString();
    goldStaticProfit = await goldStaticProfit.save();

    let goldProfit = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ key: this.GOLD_PROFIT }).build(),
    );
    goldProfit.value = dto.goldProfit.toString();
    goldProfit = await goldProfit.save();

    let goldTax = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ key: this.GOLD_TAX }).build(),
    );
    goldTax.value = dto.goldTax.toString();
    goldTax = await goldTax.save();

    return {
      result: 'ok',
    };
  }
}
