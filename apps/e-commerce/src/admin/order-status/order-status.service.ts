import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';
import { ECOrderStatus } from '@rahino/database/models/ecommerce-eav/ec-order-status.entity';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class OrderStatusService {
  constructor(
    @InjectModel(ECOrderStatus)
    private readonly repository: typeof ECOrderStatus,
  ) {}
  async findAll(user: User, filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder();
    return {
      result: await this.repository.findAll(queryBuilder.build()),
      total: await this.repository.count(queryBuilder.build()),
    };
  }
  async findById(user: User, entityId: number) {
    let queryBuilder = new QueryOptionsBuilder().filter({ id: entityId });
    return {
      result: await this.repository.findAll(queryBuilder.build()),
    };
  }
}
