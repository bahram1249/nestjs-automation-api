import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECInventoryHistory } from '@rahino/localdatabase/models';
import { ECInventoryTrackChangeStatus } from '@rahino/localdatabase/models';
import { ECInventory } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class InventoryHistoryService {
  constructor(
    @InjectModel(ECInventoryHistory)
    private readonly repository: typeof ECInventoryHistory,
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
  ) {}

  async findAll(user: User, inventoryId: bigint, filter: ListFilter) {
    const inventory = await this.inventoryRepository.findOne(
      new QueryOptionsBuilder().filter({ id: inventoryId }).build(),
    );
    if (!inventory) {
      throw new NotFoundException("the inventory isn't found!");
    }
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder.filter({ inventoryId: inventoryId });

    const count = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .include([
        {
          attributes: ['id', 'name'],
          model: ECInventoryTrackChangeStatus,
          as: 'inventoryTrackStatus',
          required: false,
        },
        {
          attributes: ['id', 'title', 'sku', 'slug'],
          model: ECProduct,
          as: 'product',
          required: false,
        },
      ])
      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy })
      .offset(filter.offset)
      .limit(filter.limit);

    const result = await this.repository.findAll(queryBuilder.build());

    return {
      result: result,
      total: count,
    };
  }
}
