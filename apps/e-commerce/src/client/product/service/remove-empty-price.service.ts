import { Injectable } from '@nestjs/common';
import { ECProduct } from '@rahino/localdatabase/models';

/*
when we filtering based price
product return it self but some inventories have no price
*/
@Injectable()
export class RemoveEmptyPriceService {
  constructor() {}
  async applyProducts(products: ECProduct[]) {
    const promises = [];
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
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
