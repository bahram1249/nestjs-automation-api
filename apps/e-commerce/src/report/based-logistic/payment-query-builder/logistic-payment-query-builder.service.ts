import { Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import {
  ECLogisticOrder,
  ECPayment,
  ECPaymentGateway,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Op, FindAttributeOptions } from 'sequelize';
import { Order } from '@rahino/query-filter';

@Injectable()
export class LogisticPaymentQueryBuilderService {
  private builder: QueryOptionsBuilder;
  constructor() {
    this.builder = new QueryOptionsBuilder();
  }

  init(rawQuery: boolean) {
    this.builder = new QueryOptionsBuilder();
    if (rawQuery == false) {
      this.builder.include([
        {
          model: User,
          as: 'user',
        },
      ]);
    } else {
      this.builder.raw(true);
    }
    return this;
  }

  nonDeleted() {
    this.builder.filter({
      isDeleted: 0,
    });
    return this;
  }

  addBeginDate(beginDate: string) {
    this.builder.filter(
      Sequelize.where(
        Sequelize.fn(
          'cast',
          Sequelize.col('ECLogisticOrder.createdAt'),
          'date',
        ),
        '>=',
        beginDate,
      ),
    );
    return this;
  }

  addEndDate(endDate: string) {
    this.builder.filter(
      Sequelize.where(
        Sequelize.fn(
          'cast',
          Sequelize.col('ECLogisticOrder.createdAt'),
          'date',
        ),
        '<=',
        endDate,
      ),
    );
    return this;
  }

  addPaymentGatewayId(paymentGatewayId: number) {
    this.builder.filter({ paymentGatewayId: paymentGatewayId });
    return this;
  }

  addOrderId(orderId: number) {
    this.builder.filter({ id: orderId });
    return this;
  }

  onlyPaid() {
    this.builder.filter(
      Sequelize.where(Sequelize.col('ECLogisticOrder.paymentId'), Op.not, null),
    );
    return this;
  }

  includePayment() {
    this.builder.include([
      {
        model: ECPayment,
        as: 'payment',
        required: true,
        include: [
          {
            model: ECPaymentGateway,
            as: 'paymentGateway',
          },
        ],
      },
    ]);
    return this;
  }

  attributes(attributes: FindAttributeOptions) {
    this.builder.attributes(attributes);
    return this;
  }
  offset(offset?: number) {
    this.builder.offset(offset);
    return this;
  }
  limit(limit?: number) {
    this.builder.limit(limit);
    return this;
  }
  order(orderArg: Order) {
    this.builder.order(orderArg);
    return this;
  }

  rawQuery(flag: boolean) {
    this.builder.raw(flag);
    return this;
  }

  build() {
    return this.builder.build();
  }
}
