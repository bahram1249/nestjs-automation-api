import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { CAL_PRICE_PROVIDER_TOKEN } from '@rahino/ecommerce/admin/product/price-cal-factory/constants';
import { ICalPrice } from '@rahino/ecommerce/admin/product/price-cal-factory/interface/cal-price.interface';
import {
  Constants,
  PRODUCT_INVENTORY_STATUS_QUEUE,
} from '@rahino/ecommerce/inventory/constants';
import { InventoryPriceDto } from '@rahino/ecommerce/inventory/dto/inventory-price.dto';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { VariationPriceEnum } from '@rahino/ecommerce/user/stock/enum';
import { ListFilterV2Factory } from '@rahino/query-filter/provider/list-filter-v2.factory';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import axios from 'axios';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as _ from 'lodash';

@Injectable()
export class RetrievePricePersianApiService {
  private readonly GOLD_CURRENT_PRICE = 'GOLD_CURRENT_PRICE';
  private readonly GOLD_740_PRICE = 'GOLD_740_PRICE';
  private readonly GOLD_24_PRICE = 'GOLD_24_PRICE';
  private readonly GOLD_SECOND_HAND_PRICE = 'GOLD_SECOND_HAND_PRICE';
  private readonly GOLD_CURRENT_PRICE_JOB_STATUS =
    'GOLD_CURRENT_PRICE_JOB_STATUS';
  private readonly GOLD_CURRENT_PRICE_JOB_PROBLEM =
    'GOLD_CURRENT_PRICE_JOB_PROBLEM';
  private readonly gold_18_key = 137120;
  private readonly gold_18_740_key = 391295;
  private readonly gold_24_key = 137121;
  private readonly gold_second_hand_key = 391298;
  private readonly url =
    'https://studio.persianapi.com/index.php/web-service/gold?format=json&limit=30&page=1';

  constructor(
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    @InjectModel(ECInventoryPrice)
    private readonly inventoryPriceRepository: typeof ECInventoryPrice,
    @Inject(CAL_PRICE_PROVIDER_TOKEN)
    private readonly calPriceService: ICalPrice,
    @InjectQueue(PRODUCT_INVENTORY_STATUS_QUEUE)
    private productInventoryQueue: Queue,
    private listFilterFactory: ListFilterV2Factory,
    private readonly config: ConfigService,
  ) {}

  private async callApiToGetNewPrice() {
    try {
      const persianApiToken = this.config.get<string>('PERSIAN_API_TOKEN');
      const res = await axios.get(this.url, {
        headers: {
          Authorization: persianApiToken,
        },
        responseType: 'json',
      });
      if (this.isSuccessful(res.status)) {
        // get all items
        const items: any[] = res.data.result.data;
        // filter gold price item
        const goldPriceItem = items.find(
          (item) => item.key == this.gold_18_key,
        );
        // if not founded
        if (goldPriceItem == null) {
          await this.enableProblem();
          return;
        }
        await this.updateCurrentPrice(Number(goldPriceItem['قیمت']) / 10);

        const gold740PriceItem = items.find(
          (item) => item.key == this.gold_18_740_key,
        );

        if (gold740PriceItem == null) {
          await this.enableProblem();
          return;
        }
        await this.updateGold740Price(Number(gold740PriceItem['قیمت']) / 10);

        const gold24PriceItem = items.find(
          (item) => item.key == this.gold_24_key,
        );

        if (gold24PriceItem == null) {
          await this.enableProblem();
          return;
        }

        await this.updateGold24Price(Number(gold24PriceItem['قیمت']) / 10);

        const goldSecondHandItem = items.find(
          (item) => item.key == this.gold_second_hand_key,
        );

        if (goldSecondHandItem == null) {
          await this.enableProblem();
          return;
        }

        await this.updateSecondHandGoldPrice(
          Number(gold24PriceItem['قیمت']) / 10,
        );

        await this.disableProblem();
      } else {
        await this.enableProblem();
      }
    } catch {
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

  private async updateGold740Price(price: number) {
    await this.settingRepository.update(
      {
        value: price,
      },
      {
        where: {
          key: this.GOLD_740_PRICE,
        },
      },
    );
  }

  private async updateGold24Price(price: number) {
    await this.settingRepository.update(
      {
        value: price,
      },
      {
        where: {
          key: this.GOLD_24_PRICE,
        },
      },
    );
  }

  private async updateSecondHandGoldPrice(price: number) {
    await this.settingRepository.update(
      {
        value: price,
      },
      {
        where: {
          key: this.GOLD_SECOND_HAND_PRICE,
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
        if (inventories.length == 0) {
          break;
        }
        for (let index = 0; index < inventories.length; index++) {
          inventories[index].inventoryStatusId =
            inventories[index].qty > 0
              ? InventoryStatusEnum.available
              : InventoryStatusEnum.unavailable;

          let oldInventoryPrices = await this.inventoryPriceRepository.findAll(
            new QueryOptionsBuilder()
              .filter(
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('ECInventoryPrice.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              )
              .filter({
                inventoryId: inventories[index].id,
              })
              .build(),
          );

          let inventoryPrice = new InventoryPriceDto();
          inventoryPrice.variationPriceId = VariationPriceEnum.firstPrice;
          inventoryPrice.price = BigInt(0);
          let newPrice = await this.calPriceService.getPrice(
            inventories[index].product,
            inventoryPrice,
            null,
            inventories[index].weight,
          );
          inventoryPrice = _.omit(newPrice, ['buyPrice']);

          await this.inventoryPriceRepository.create({
            inventoryId: inventories[index].id,
            variationPriceId: inventoryPrice.variationPriceId,
            price: inventoryPrice.price,
            buyPrice: newPrice.buyPrice,
            userId: 1,
          });

          for (let i = 0; i < oldInventoryPrices.length; i++) {
            oldInventoryPrices[i].isDeleted = true;
            await oldInventoryPrices[i].save();
          }

          inventories[index] = await inventories[index].save();

          const keepJobs = this.config.get<number>(
            'PRODUCT_INVENTORY_STATUS_KEEPJOBS',
          );
          await this.productInventoryQueue.add(
            Constants.productInventoryStatusJob(
              inventories[index].productId.toString(),
            ),
            {
              productId: inventories[index].productId,
            },
            { removeOnComplete: keepJobs },
          );
        }
        page += 1;
      }
    }
  }
}
