import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';
import { User } from '@rahino/database';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { ECPaymentStatus } from '@rahino/localdatabase/models';
import { ECPaymentType } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(ECPayment)
    private readonly repository: typeof ECPayment,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder()
      .filter({ userId: user.id })
      .filter(
        this.seqHelp.whereIsNullColumnEqualToZero('ECPayment.isDeleted', 0),
      );
    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .attributes([
        'id',
        'paymentGatewayId',
        'paymentTypeId',
        'paymentStatusId',
        'totalprice',
        'orderId',
        'userId',
        'isDeleted',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'name'],
          model: ECPaymentType,
          as: 'paymentType',
        },
        {
          attributes: ['id', 'name'],
          model: ECPaymentStatus,
          as: 'paymentStatus',
        },
        {
          attributes: ['id', 'name'],
          model: ECPaymentGateway,
          as: 'paymentGateway',
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'paymentGatewayId',
          'paymentTypeId',
          'paymentStatusId',
          'totalprice',
          'orderId',
          'userId',
          'isDeleted',
          'createdAt',
          'updatedAt',
        ])
        .include([
          {
            attributes: ['id', 'name'],
            model: ECPaymentType,
            as: 'paymentType',
          },
          {
            attributes: ['id', 'name'],
            model: ECPaymentStatus,
            as: 'paymentStatus',
          },
          {
            attributes: ['id', 'name'],
            model: ECPaymentGateway,
            as: 'paymentGateway',
          },
        ])
        .filter({ id: entityId })
        .filter({ userId: user.id })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero('ECPayment.isDeleted', 0),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: item,
    };
  }
}
