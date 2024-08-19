import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import axios from 'axios';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

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
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    private listFilterFactory: ListFilterV2Factory,
    private readonly config: ConfigService,
  ) {}

  private async callApiToGetNewPrice() {
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
      const goldPriceItem = items.find((item) => item.key == this.gold_18_key);
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
    await this.getPriceThenUpdate();
  }

  private async getPriceThenUpdate() {
    const goldCurrentJobStatusSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE_JOB_STATUS })
        .build(),
    );
    const enable = goldCurrentJobStatusSetting.value == 'true';
    if (enable) {
      await this.callApiToGetNewPrice();
    }
    await this.updatePrice();
  }

  private async updatePrice() {
    const goldCurrentJobStatusSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE_JOB_STATUS })
        .build(),
    );
    const enable = goldCurrentJobStatusSetting.value == 'true';
    const goldCurrentPriceJobProblem = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE_JOB_PROBLEM })
        .build(),
    );
    const problem = goldCurrentPriceJobProblem.value == 'true';

    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECInventory.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );

    const listFilter = await this.listFilterFactory.create();
    listFilter.limit = 10;
    listFilter.offset = 0;
    let more = true;
    let page = 1;

    // set all inventories to suspend
    if (enable == true && problem == true) {
      while (more) {
        let inventories = await this.inventoryRepository.findAll(
          queryBuilder
            .limit(listFilter.limit)
            .offset((page - 1) * listFilter.limit)
            .build(),
        );
        if (inventories.length == 0) {
          break;
        }
        await this.inventoryRepository.update(
          {
            inventoryStatusId: InventoryStatusEnum.suspend,
          },
          {
            where: {
              id: {
                [Op.in]: inventories.map((item) => item.id),
              },
            },
          },
        );
        page += 1;
      }
    } else {
      queryBuilder = queryBuilder.include([
        { model: ECProduct, as: 'product' },
      ]);
      while (more) {
        let inventories = await this.inventoryRepository.findAll(
          queryBuilder
            .limit(listFilter.limit)
            .offset((page - 1) * listFilter.limit)
            .build(),
        );
        for (let index = 0; index < inventories.length; index++) {
          inventories[index].inventoryStatusId =
            inventories[index].qty > 0
              ? InventoryStatusEnum.available
              : InventoryStatusEnum.unavailable;
        }
      }
    }
  }
}
