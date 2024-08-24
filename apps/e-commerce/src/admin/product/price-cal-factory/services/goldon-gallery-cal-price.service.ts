import { BadRequestException, Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { InventoryPriceDto } from '@rahino/ecommerce/inventory/dto/inventory-price.dto';
import { ProductPriceFormulaEnum } from '@rahino/ecommerce/util/enum';
import { InjectModel } from '@nestjs/sequelize';
import { Setting } from '@rahino/database/models/core/setting.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ProductPriceDto } from '../interface/ProductPriceDto.type';

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
    inventoryWeight?: number,
  ): Promise<InventoryPriceDto> {
    if (inventoryWeight <= 2) {
      inventoryPriceDto.price = await this.getPriceByWeightFirstFormula(
        inventoryWeight,
        dto.wages,
        dto.stoneMoney,
      );
    } else {
      inventoryPriceDto.price = await this.getPriceByWeightSecondFormula(
        inventoryWeight,
        dto.wages,
        dto.stoneMoney,
      );
    }

    return inventoryPriceDto;
  }

  async getPriceByWeightFirstFormula(
    weight: number,
    wages: number,
    stoneMoney?: bigint,
  ): Promise<bigint> {
    const goldCurrentPriceSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE })
        .build(),
    );
    const goldCurrentPrice = Number(goldCurrentPriceSetting.value);
    const realWages = Number(`1.${wages.toString()}`);
    const stonePrice = Number(stoneMoney) | 0;
    const profit = 500000;
    return BigInt(
      Math.round(
        (weight * goldCurrentPrice * realWages + profit) * 1.03 + stonePrice,
      ),
    );
  }

  async getPriceByWeightSecondFormula(
    weight: number,
    wages: number,
    stoneMoney?: bigint,
  ): Promise<bigint> {
    const goldCurrentPriceSetting = await this.settingRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ key: this.GOLD_CURRENT_PRICE })
        .build(),
    );
    const goldCurrentPrice = Number(goldCurrentPriceSetting.value);
    const realWages = Number(`1.${wages.toString()}`);
    const stonePrice = Number(stoneMoney) | 0;
    return BigInt(
      Math.round(
        weight * goldCurrentPrice * realWages + 1.07 * 1.03 + stonePrice,
      ),
    );
  }
}
