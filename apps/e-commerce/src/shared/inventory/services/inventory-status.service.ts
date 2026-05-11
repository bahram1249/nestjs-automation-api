import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECInventory } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize, Transaction } from 'sequelize';
import { InventoryStatusEnum } from '../enum';
import { ECProduct } from '@rahino/localdatabase/models';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class inventoryStatusService {
  constructor(
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
    @InjectModel(ECProduct)
    private readonly productRepository: typeof ECProduct,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async productInventoryStatusUpdate(
    productId: bigint,
    transaction?: Transaction,
  ) {
    const inventoriesCount = await this.inventoryRepository.count(
      new QueryOptionsBuilder()
        .filter({ productId: productId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero('ECInventory.isDeleted', 0),
        )
        .filter({ inventoryStatusId: InventoryStatusEnum.available })
        .transaction(transaction)
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
