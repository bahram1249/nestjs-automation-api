import { Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { InventoryPriceDto } from '@rahino/ecommerce/inventory/dto/inventory-price.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ProductPriceDto } from '../interface/ProductPriceDto.type';
import {
  GoldonInventoryPriceIncludedBuyPriceInterface,
  InventoryPriceIncludeBuyPriceDto,
} from '../interface';
import * as _ from 'lodash';

@Injectable()
export class GoldonGalleryCalPriceService implements ICalPrice {
  private readonly GOLD_CURRENT_PRICE = 'GOLD_CURRENT_PRICE';
  constructor(
    @InjectModel(Setting)
    private readonly settingRepository: typeof Setting,
  ) {}
  async getPrice(
    dto: ProductPriceDto,
    inventoryPriceDto: InventoryPriceDto,
    buyPrice?: bigint,
    inventoryWeight?: number,
  ): Promise<InventoryPriceIncludeBuyPriceDto> {
    if (inventoryWeight <= 2) {
      let { price, buyPrice: newBuyPrice } =
        await this.getPriceByWeightFirstFormula(
          inventoryWeight,
          dto.wages,
          dto.stoneMoney,
        );
      inventoryPriceDto.price = price;
      buyPrice = newBuyPrice;
    } else {
      let { price, buyPrice: newBuyPrice } =
        await this.getPriceByWeightSecondFormula(
          inventoryWeight,
          dto.wages,
          dto.stoneMoney,
        );
      inventoryPriceDto.price = price;
      buyPrice = newBuyPrice;
    }

    return _.extend(inventoryPriceDto, { buyPrice: buyPrice });
  }

  async getPriceByWeightFirstFormula(
    weight: number,
    wages: number,
    stoneMoney?: bigint,
  ): Promise<GoldonInventoryPriceIncludedBuyPriceInterface> {
    const goldCurrentPriceSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE })
        .build(),
    );
    const goldCurrentPrice = Number(goldCurrentPriceSetting.value);
    const realWages = Number(`1.${wages.toString()}`);
    const stonePrice = Number(stoneMoney) | 0;
    const profit = 500000;
    const price = Math.round(
      (weight * goldCurrentPrice * realWages + profit) * 1.03 + stonePrice,
    );
    const buyPrice = price - profit;
    return { price: BigInt(price), buyPrice: BigInt(buyPrice) };
  }

  async getPriceByWeightSecondFormula(
    weight: number,
    wages: number,
    stoneMoney?: bigint,
  ): Promise<GoldonInventoryPriceIncludedBuyPriceInterface> {
    const goldCurrentPriceSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE })
        .build(),
    );
    const goldCurrentPrice = Number(goldCurrentPriceSetting.value);
    const realWages = Number(`1.${wages.toString()}`);
    const stonePrice = Number(stoneMoney) | 0;
    const price = BigInt(
      Math.round(
        weight * goldCurrentPrice * realWages * 1.07 * 1.03 + stonePrice,
      ),
    );
    const buyPrice = BigInt(
      Math.round(weight * goldCurrentPrice * realWages * 1.03 + stonePrice),
    );
    return { price: price, buyPrice: buyPrice };
  }
}
