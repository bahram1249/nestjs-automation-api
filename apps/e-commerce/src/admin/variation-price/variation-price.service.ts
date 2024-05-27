import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class VariationPriceService {
  constructor(
    @InjectModel(ECVariationPrice)
    private readonly repository: typeof ECVariationPrice,
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
