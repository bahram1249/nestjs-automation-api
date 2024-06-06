import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
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
  async findAll(user: User, filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECPaymentGateway.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    return {
      result: await this.repository.findAll(queryBuilder.build()),
      total: await this.repository.count(queryBuilder.build()),
    };
  }
  async findById(user: User, entityId: number) {
    let queryBuilder = new QueryOptionsBuilder()
      .filter({ id: entityId })
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
      );
    return {
      result: await this.repository.findAll(queryBuilder.build()),
    };
  }
}
