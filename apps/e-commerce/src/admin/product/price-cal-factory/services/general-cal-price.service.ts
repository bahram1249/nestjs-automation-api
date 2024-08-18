import { Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { InventoryPriceDto } from '@rahino/ecommerce/inventory/dto/inventory-price.dto';
import { ProductPriceDto } from '../interface/ProductPriceDto.type';

@Injectable()
export class GeneralCalPriceService implements ICalPrice {
  constructor() {}
  async getPrice(
    dto: ProductPriceDto,
    inventoryPrice: InventoryPriceDto,
    inventoryWeight?: number,
  ): Promise<InventoryPriceDto> {
    return inventoryPrice;
  }
}
