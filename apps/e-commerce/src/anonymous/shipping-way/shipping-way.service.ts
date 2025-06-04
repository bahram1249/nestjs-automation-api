import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import * as _ from 'lodash';
import { ECShippingWay } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';

@Injectable()
export class ShippingWayService {
  constructor(
    @InjectModel(ECShippingWay) private repository: typeof ECShippingWay,
  ) {}

  async findAll(dto: ListFilter) {
    const count = await this.repository.count();

    const result = await this.repository.findAll({
      attributes: ['id', 'title'],
    });
    return {
      result: result,
      total: count,
    };
  }
}
