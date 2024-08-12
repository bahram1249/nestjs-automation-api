import { Injectable } from '@nestjs/common';
import { ICalPrice } from '../interface/cal-price.interface';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';

@Injectable()
export class GoldonGalleryCalPriceService implements ICalPrice {
  constructor() {}
  async getPrice(product: ECProduct, inventory: ECInventory) {
    return await this.getPriceByWeightFirstFormula(product.weight);
  }

  async getPriceByWeightFirstFormula(weight: number) {
    return weight * 10;
  }

  async getPriceByWeightSecondFormula(weight: number) {
    return weight * 10;
  }
}
