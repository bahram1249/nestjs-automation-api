import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECInventoryTrackChangeStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-track-change-status.entity';
import { InventoryTrackChangeStatusEnum } from '../util/enum';
import { Transaction } from 'sequelize';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class InventoryTrackChangeService {
  constructor(
    @InjectModel(ECInventoryTrackChangeStatus)
    private readonly repository: typeof ECInventoryTrackChangeStatus,
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
      new QueryOptionsBuilder().filter({ id: inventoryId }).build(),
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
