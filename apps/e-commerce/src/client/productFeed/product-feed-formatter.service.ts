import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ECProduct } from '@rahino/localdatabase/models';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';

@Injectable()
export class ProductFeedFormatterService {
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
        ? 'in stock'
        : 'out of stock';
    const price =
      product.inventoryStatusId == InventoryStatusEnum.available
        ? product.inventories[0].firstPrice.appliedDiscount?.newPrice ||
          product.inventories[0].firstPrice.price
        : 0;
    const regularPrice =
      product.inventoryStatusId == InventoryStatusEnum.available
        ? product.inventories[0].firstPrice.price
        : 0;

    const minioClient = this.config.get('MINIO_ENDPOINT');
    const prefixPath = 'https://' + minioClient + '/products/';

    const imageLinks = product.attachments.map(
      (attachment) => prefixPath + attachment.fileName,
    );

    return {
      id: String(product.id),
      title: product.title,
      subtitle: product.title,
      slug: product.slug,
      link: `${frontUrl}/product/${product.sku}/${product.slug}`,
      imageLink: imageLinks,
      availability: availability,
      regular_price: Number(regularPrice),
      brand: product.brand?.name,
      category: product.entityType?.name,
      sale_price: Number(price),
      description: {},
    };
  }
}
