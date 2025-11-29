import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryTrackChangeStatusEnum } from '../enum';
import { Transaction } from 'sequelize';
import { ECInventory, ECInventoryHistory } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class LogisticInventoryTrackChangeService {
  constructor(
    @InjectModel(ECInventoryHistory)
    private readonly repository: typeof ECInventoryHistory,
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
  ) {}

  async changeStatus(
    inventoryId: bigint,
    inventoryTrackChangeStatus: InventoryTrackChangeStatusEnum,
    qty: number,
    logisticOrderId?: bigint,
    transaction?: Transaction,
  ) {
    const inventory = await this.inventoryRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: inventoryId })
        .transaction(transaction)
        .build(),
    );

    await this.repository.create(
      {
        inventoryId: inventory.id,
        productId: inventory.productId,
        qty: qty,
        inventoryTrackChangeStatusId: inventoryTrackChangeStatus,
        logisticOrderId: logisticOrderId,
      },
      { transaction },
    );
  }
}
