import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ECProduct } from '@rahino/localdatabase/models';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';
import { title } from 'process';

@Injectable()
export class TorobProductFormatterService {
  constructor(private readonly config: ConfigService) {}

  async listFormatter(products: ECProduct[]) {
    const promises = [];
    for (let index = 0; index < products.length; index++) {
      const product = products[index];
      promises.push(this.singleFormatter(product));
    }
    return await Promise.all(promises);
  }

  async singleFormatter(product: ECProduct) {
    const frontUrl = this.config.get('BASE_FRONT_URL');
    const availability =
      product.inventoryStatusId == InventoryStatusEnum.available
        ? 'instock'
        : 'outofstock';
    const price =
      product.inventoryStatusId == InventoryStatusEnum.available
        ? product.inventories[0].firstPrice.appliedDiscount?.newPrice ||
          product.inventories[0].firstPrice.price
        : 0;
    const oldPrice =
      product.inventoryStatusId == InventoryStatusEnum.available
        ? product.inventories[0].firstPrice.price
        : 0;

    return {
      title: product.title,
      product_id: Number(product.id),
      page_url: `${frontUrl}/product/${product.sku}/${product.slug}`,
      price: Number(price),
      availability: availability,
      old_price: Number(oldPrice),
    };
  }
}
