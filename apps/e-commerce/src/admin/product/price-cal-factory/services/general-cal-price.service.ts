import { Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { ProductDto } from '../../dto';
import { InventoryPriceDto } from '@rahino/ecommerce/inventory/dto/inventory-price.dto';

@Injectable()
export class GeneralCalPriceService implements ICalPrice {
  constructor() {}
  async getPrice(
    dto: Pick<
      ProductDto,
      'weight' | 'productFormulaId' | 'wages' | 'stoneMoney'
    >,
    inventoryPrice: InventoryPriceDto,
  ): Promise<InventoryPriceDto> {
    return inventoryPrice;
  }
}
