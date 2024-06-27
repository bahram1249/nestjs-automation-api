import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrderShipmentWay } from '@rahino/database/models/ecommerce-eav/ec-order-shipmentway.entity';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class OrderShipmentWayService {
  constructor(
    @InjectModel(ECOrderShipmentWay)
    private readonly repository: typeof ECOrderShipmentWay,
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
