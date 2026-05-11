import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';
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
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(filter: ListFilter) {
    const payments = await this.paymentGatewayRepository.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'name', 'imageUrl'])
        .filter({ eligibleChargeWallet: true })
        .filter(this.seqHelp.whereIsNullColumnEqualToZero('isDeleted', 0))
        .limit(filter.limit)
        .offset(filter.offset)
        .build(),
    );

    return {
      result: payments,
    };
  }
}
