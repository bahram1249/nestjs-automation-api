import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECInventoryHistory } from '@rahino/database/models/ecommerce-eav/ec-inventory-history.entity';
import { ECInventoryTrackChangeStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-track-change-status.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class InventoryHistoryService {
  constructor(
    @InjectModel(ECInventoryHistory)
    private readonly repository: typeof ECInventoryHistory,
  ) {}

  async findAll(user: User, inventoryId: bigint, filter: ListFilter) {
    let inventory = await this.repository.findOne(
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
