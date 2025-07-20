import { Injectable, Scope } from '@nestjs/common';
import { User } from '@rahino/database';
import { ECOrderStatus } from '@rahino/localdatabase/models';
import { ECPayment } from '@rahino/localdatabase/models';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { FindAttributeOptions, Op, Sequelize } from 'sequelize';

@Injectable({ scope: Scope.REQUEST })
export class OrderQueryBuilderService {
  private builder: QueryOptionsBuilder;
  private groupByQuery = false;
  constructor() {
    this.builder = new QueryOptionsBuilder();
    this.builder.include([]);
  }

  init(groupByQuery: boolean) {
    this.groupByQuery = groupByQuery;
    return this;
  }

  nonDeleted() {
    this.builder = this.builder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    return this;
  }

  addBeginDate(beginDate: string) {
    this.builder = this.builder.filter({
      gregorianAtPersian: {
        [Op.gte]: beginDate,
      },
    });
    return this;
  }

  addEndDate(endDate: string) {
    this.builder = this.builder.filter({
      gregorianAtPersian: {
        [Op.lt]: Sequelize.fn(
          'dateadd',
          Sequelize.literal('day'),
          Sequelize.literal('1'),
          endDate,
        ),
      },
    });
    return this;
  }

  addShipmentWay(shipmentType: OrderShipmentwayEnum) {
    this.builder = this.builder.filter({
      orderShipmentWayId: shipmentType,
    });
    return this;
  }

  addNegativeOrderStatus(orderStatus: OrderStatusEnum) {
    this.builder = this.builder.filter({
      orderStatusId: {
        [Op.ne]: orderStatus,
      },
    });
    return this;
  }

  addCourier(userId: bigint) {
    this.builder = this.builder.filter({
      courierUserId: userId,
    });
    return this;
  }

  addPaymentGatewayId(paymentGatewayId: number) {
    this.builder = this.builder.filter(
      Sequelize.where(Sequelize.col('payment.paymentGatewayId'), {
        [Op.eq]: paymentGatewayId,
      }),
    );
    return this;
  }

  addOrderId(orderId: bigint) {
    this.builder = this.builder.filter({ id: orderId });
    return this;
  }

  includeOrderStatus() {
    this.builder = this.builder.thenInclude({
      attributes: this.groupByQuery ? [] : ['id', 'name'],
      model: ECOrderStatus,
      as: 'orderStatus',
      required: false,
    });
    return this;
  }

  includeCourierUser() {
    this.builder = this.builder.thenInclude({
      attributes: this.groupByQuery
        ? []
        : ['id', 'firstname', 'lastname', 'username', 'phoneNumber'],
      model: User,
      as: 'courierUser',
      required: false,
    });
    return this;
  }

  includePayment() {
    this.builder = this.builder.thenInclude({
      attributes: this.groupByQuery
        ? []
        : ['id', 'paymentGatewayId', 'paymentStatusId'],
      model: ECPayment,
      as: 'payment',
      required: false,
    });
    return this;
  }

  attributes(attributes: FindAttributeOptions) {
    this.builder = this.builder.attributes(attributes);
    return this;
  }

  limit(limit: number) {
    this.builder = this.builder.limit(limit);
    return this;
  }

  offset(offset: number) {
    this.builder = this.builder.offset(offset);
    return this;
  }

  rawQuery(flag: boolean) {
    this.builder = this.builder.raw(flag);
    return this;
  }

  build() {
    return this.builder.build();
  }
}
