import { Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { InventoryPriceDto } from '@rahino/ecommerce/shared/inventory/dto/inventory-price.dto';
import { ProductPriceDto } from '../interface/ProductPriceDto.type';
import { InventoryPriceIncludeBuyPriceDto } from '../interface';
import * as _ from 'lodash';

@Injectable()
export class GeneralCalPriceService implements ICalPrice {
  constructor() {}
  async getPrice(
    dto: ProductPriceDto,
    inventoryPrice: InventoryPriceDto,
    buyPrice?: bigint,
    inventoryWeight?: number,
  ): Promise<InventoryPriceIncludeBuyPriceDto> {
    return _.extend(inventoryPrice, { buyPrice: buyPrice });
  }
}
