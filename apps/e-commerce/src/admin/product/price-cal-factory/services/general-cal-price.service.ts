import { Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';

@Injectable()
export class GeneralCalPriceService implements ICalPrice {
  constructor() {}
  async getPrice(product: ECProduct, inventory: ECInventory) {
    throw new Error('Method not implemented.');
  }
}
