import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { InventoryStatusEnum } from './enum';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';

@Injectable()
export class inventoryStatusService {
  constructor(
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    @InjectModel(ECProduct)
    private readonly productRepository: typeof ECProduct,
  ) {}

  async productInventoryStatusUpdate(
    productId: bigint,
    transaction?: Transaction,
  ) {
    const inventoriesCount = await this.inventoryRepository.count(
      new QueryOptionsBuilder()
        .filter({ productId: productId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECInventory.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ inventoryStatusId: InventoryStatusEnum.available })
        .build(),
    );
    if (inventoriesCount > 0) {
      // update product inventorystatus
      await this.productRepository.update(
        { inventoryStatusId: InventoryStatusEnum.available },
        {
          where: {
            id: productId,
          },
          transaction: transaction,
        },
      );
    } else {
      // update product inventorystatus
      await this.productRepository.update(
        { inventoryStatusId: InventoryStatusEnum.unavailable },
        {
          where: {
            id: productId,
          },
          transaction: transaction,
        },
      );
    }
  }
}
