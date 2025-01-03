import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { safeJsonParse } from '@rahino/commontools';
import { ECInventoryStatus } from '@rahino/database';
import { ECInventory } from '@rahino/database';
import { ECProduct } from '@rahino/database';
import { InventoryStatusEnum } from '@rahino/ecommerce/inventory/enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { RedisRepository } from '@rahino/redis-client';

@Injectable()
export class ApplyInventoryStatus {
  constructor(
    @InjectModel(ECInventoryStatus)
    private readonly repository: typeof ECInventoryStatus,
    private readonly redisRepository: RedisRepository,
  ) {}
  async applyProducts(products: ECProduct[]) {
    const promises = [];
    for (let index = 0; index < products.length; index++) {
      let product = products[index];
      promises.push(this.applyProduct(product));
    }
    return await Promise.all(promises);
  }
  async applyProduct(product: ECProduct) {
    if (product.inventories.length == 0) {
      let unavailableInventoryStatus: ECInventoryStatus = null;
      const foundInventoryStatus = await this.redisRepository.get(
        'inventory',
        'unavailable',
      );
      if (foundInventoryStatus != null && foundInventoryStatus != '') {
        unavailableInventoryStatus =
          safeJsonParse<ECInventoryStatus>(foundInventoryStatus);
      } else {
        unavailableInventoryStatus = await this.repository.findOne(
          new QueryOptionsBuilder()
            .attributes(['id', 'name'])
            .filter({ id: InventoryStatusEnum.unavailable })
            .build(),
        );
        await this.redisRepository.set(
          'inventory',
          'unavailable',
          JSON.stringify(unavailableInventoryStatus),
        );
      }
      product.set('inventoryStatusId', InventoryStatusEnum.unavailable);
      product.set('inventoryStatus', unavailableInventoryStatus);
    }
    return product;
  }
}
