import { Injectable } from '@nestjs/common';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';

@Injectable()
export class RemoveEmptyPriceService {
  constructor() {}
  async applyProducts(products: ECProduct[]) {
    const promises = [];
    for (let index = 0; index < products.length; index++) {
      let product = products[index];
      promises.push(this.applyProduct(product));
    }
    return await Promise.all(promises);
  }
  async applyProduct(product: ECProduct) {
    const inventories = product.inventories.filter(
      (inventory) => inventory.firstPrice != null,
    );
    product.set('inventories', inventories);
    return product;
  }
}
