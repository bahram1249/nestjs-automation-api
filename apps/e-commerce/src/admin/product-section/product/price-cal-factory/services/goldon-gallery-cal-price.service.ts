import { Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { InventoryPriceDto } from '@rahino/ecommerce/shared/inventory/dto/inventory-price.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database';
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
  private readonly GOLD_STATIC_PROFIT = 'GOLD_STATIC_PROFIT';
  private readonly GOLD_PROFIT = 'GOLD_PROFIT';
  private readonly GOLD_TAX = 'GOLD_TAX';
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
    if (dto.productFormulaId == 1) {
      const { price, buyPrice: newBuyPrice } =
        await this.getPriceByWeightFirstFormula(
          inventoryWeight,
          dto.wages,
          dto.stoneMoney,
        );
      inventoryPriceDto.price = price;
      buyPrice = newBuyPrice;
    } else {
      const { price, buyPrice: newBuyPrice } =
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
    const goldTaxSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder().filter({ key: this.GOLD_TAX }).build(),
    );
    const goldStaticProfit = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_STATIC_PROFIT })
        .build(),
    );
    const tax = Number(goldTaxSetting.value);
    const realWages = Number(`1.${wages.toString().padStart(2, '0')}`);
    const stonePrice = Number(stoneMoney) | 0;
    const staticProfit = Number(goldStaticProfit.value);
    const price = Math.round(
      (weight * goldCurrentPrice * realWages + staticProfit) * tax + stonePrice,
    );
    const buyPrice = price - staticProfit;
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
    const goldSettingTax = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          key: this.GOLD_TAX,
        })
        .build(),
    );
    const goldProfitSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder().filter({ key: this.GOLD_PROFIT }).build(),
    );

    const realWages = Number(`1.${wages.toString().padStart(2, '0')}`);
    const stonePrice = Number(stoneMoney) | 0;
    const tax = Number(goldSettingTax.value);
    const profit = Number(goldProfitSetting.value);
    const price = BigInt(
      Math.round(
        weight * goldCurrentPrice * realWages * profit * tax + stonePrice,
      ),
    );
    const buyPrice = BigInt(
      Math.round(weight * goldCurrentPrice * realWages * tax + stonePrice),
    );
    return { price: price, buyPrice: buyPrice };
  }
}
