import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { InventoryTrackChangeStatusEnum } from '../enum';
import { Transaction } from 'sequelize';
import { ECInventory } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ECInventoryHistory } from '@rahino/localdatabase/models';

@Injectable()
export class InventoryTrackChangeService {
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
    orderId?: bigint,
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
        orderId: orderId,
      },
      {
        transaction: transaction,
      },
    );
  }
}
