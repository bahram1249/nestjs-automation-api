import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECInventoryStatus } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class InventoryStatusService {
  constructor(
    @InjectModel(ECInventoryStatus)
    private readonly repository: typeof ECInventoryStatus,
  ) {}
  async findAll(filter: ListFilter) {
    const queryBuilder = new QueryOptionsBuilder();
    return {
      result: await this.repository.findAll(queryBuilder.build()),
      total: await this.repository.count(queryBuilder.build()),
    };
  }

  async findById(entityId: number) {
    const queryBuilder = new QueryOptionsBuilder().filter({ id: entityId });
    return {
      result: await this.repository.findAll(queryBuilder.build()),
    };
  }
}
