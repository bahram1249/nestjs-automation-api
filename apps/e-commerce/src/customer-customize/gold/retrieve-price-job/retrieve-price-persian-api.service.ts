import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import axios from 'axios';

@Injectable()
export class RetrievePricePersianApiService {
  private readonly GOLD_CURRENT_PRICE = 'GOLD_CURRENT_PRICE';
  private readonly GOLD_CURRENT_PRICE_JOB_STATUS =
    'GOLD_CURRENT_PRICE_JOB_STATUS';
  private readonly GOLD_CURRENT_PRICE_JOB_PROBLEM =
    'GOLD_CURRENT_PRICE_JOB_PROBLEM';
  private readonly gold_18_key = 391295;
  private readonly url =
    'https://studio.persianapi.com/index.php/web-service/common/gold-currency-coin?format=json&page=1';

  constructor(
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    private readonly config: ConfigService,
  ) {}

  private async callApiToGetNewPrice() {
    const currentPriceJobStatus = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_CURRENT_PRICE_JOB_STATUS,
        })
        .build(),
    );
    const isActive = currentPriceJobStatus.value == 'true';
    if (isActive) {
      const persianApiToken = this.config.get<string>('PERSIAN_API_TOKEN');
      const res = await axios.get(this.url, {
        headers: {
          Authorization: persianApiToken,
        },
        responseType: 'json',
      });
      if (this.isSuccessful(res.status)) {
        // get all items
        const items: any[] = res.data;
        // filter gold price item
        const goldPriceItem = items.find(
          (item) => item.key == this.gold_18_key,
        );
        // if not founded
        if (goldPriceItem != null) {
          await this.enableProblem();
          return;
        }
        await this.updateCurrentPrice(Number(goldPriceItem.price) / 10);
        await this.disableProblem();
      } else {
        await this.enableProblem();
      }
    }
  }

  private async updateCurrentPrice(price: number) {
    await this.settingRepository.update(
      {
        value: price,
      },
      {
        where: {
          key: this.GOLD_CURRENT_PRICE,
        },
      },
    );
  }

  private isSuccessful(status: number) {
    return status >= 200 && status <= 299;
  }

  private async enableProblem() {
    await this.settingRepository.update(
      {
        value: 'true',
      },
      {
        where: {
          key: this.GOLD_CURRENT_PRICE_JOB_PROBLEM,
        },
      },
    );
  }

  private async disableProblem() {
    await this.settingRepository.update(
      {
        value: 'false',
      },
      {
        where: {
          key: this.GOLD_CURRENT_PRICE_JOB_PROBLEM,
        },
      },
    );
  }

  public async run() {
    const setting = await this.settingRepository.findOne(
      new QueryOptionsBuilder().filter({ key: 'CUSTOMER_NAME' }).build(),
    );
    if (setting.value == 'goldongallery') {
      await this.getPriceThenUpdate();
    }
  }

  public async getPriceThenUpdate() {
    const goldCurrentJobStatusSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE_JOB_STATUS })
        .build(),
    );
    const enable = goldCurrentJobStatusSetting.value == 'true';
    if (enable) {
      await this.callApiToGetNewPrice();
    }
  }
}
