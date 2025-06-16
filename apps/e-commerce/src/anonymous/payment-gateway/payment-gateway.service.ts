import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { VariationPriceEnum } from '@rahino/ecommerce/user/shopping/stock/enum';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class PaymentGatewayService {
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly repository: typeof ECPaymentGateway,
  ) {}
  async findAll(filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder()
      .attributes(['id', 'name', 'titleMessage', 'description', 'imageUrl'])
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECPaymentGateway.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ variationPriceId: VariationPriceEnum.firstPrice });
    return {
      result: await this.repository.findAll(queryBuilder.build()),
      total: await this.repository.count(queryBuilder.build()),
    };
  }
}
