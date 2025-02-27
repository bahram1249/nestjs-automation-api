import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class ChargingWalletPaymentService {
  constructor(
    @InjectModel(ECPaymentGateway)
    private readonly paymentGatewayRepository: typeof ECPaymentGateway,
  ) {}

  async findAll(filter: ListFilter) {
    const payments = await this.paymentGatewayRepository.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'name', 'imageUrl'])
        .filter({ eligibleChargeWallet: true })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .limit(filter.limit)
        .offset(filter.offset)
        .build(),
    );

    return {
      result: payments,
    };
  }
}
