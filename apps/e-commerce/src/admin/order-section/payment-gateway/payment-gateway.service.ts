import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';
import { User } from '@rahino/database';
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
    private readonly seqHelp: SequelizeHelpService,
  ) {}
  async findAll(user: User, filter: ListFilter) {
    const queryBuilder = new QueryOptionsBuilder().filter(
      this.seqHelp.whereIsNullColumnEqualToZero(
        'ECPaymentGateway.isDeleted',
        0,
      ),
    );
    return {
      result: await this.repository.findAll(queryBuilder.build()),
      total: await this.repository.count(queryBuilder.build()),
    };
  }
  async findById(user: User, entityId: number) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({ id: entityId })
      .filter(
        this.seqHelp.whereIsNullColumnEqualToZero(
          'ECPaymentGateway.isDeleted',
          0,
        ),
      );
    return {
      result: await this.repository.findAll(queryBuilder.build()),
    };
  }
}
