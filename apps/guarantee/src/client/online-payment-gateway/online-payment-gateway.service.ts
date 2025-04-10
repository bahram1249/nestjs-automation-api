import { Injectable, NotFoundException } from '@nestjs/common';
import { GetOnlinePaymentGatewayDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSPaymentGateway } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { GSPaymentWayEnum } from '@rahino/guarantee/shared/payment-way';

@Injectable()
export class OnlinePaymentGatewayService {
  constructor(
    @InjectModel(GSPaymentGateway)
    private readonly repository: typeof GSPaymentGateway,
  ) {}

  async findAll(filter: GetOnlinePaymentGatewayDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter({ paymentWayId: GSPaymentWayEnum.Online });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'title', 'icon'])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }
}
