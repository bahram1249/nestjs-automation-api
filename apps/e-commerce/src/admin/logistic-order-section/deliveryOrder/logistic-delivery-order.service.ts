import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECLogisticOrder, ECCourier } from '@rahino/localdatabase/models';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';
import { ListFilter } from '@rahino/query-filter';

@Injectable()
export class LogisticDeliveryOrderService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly repository: typeof ECLogisticOrder,
    @InjectModel(ECCourier)
    private readonly courierRepository: typeof ECCourier,
    private readonly builder: LogisticOrderQueryBuilder,
    private readonly utilService: LogisticOrderUtilService,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    throw new NotImplementedException('Logistic delivery orders list is not implemented yet');
  }

  async findById(id: bigint, user: User) {
    throw new NotImplementedException('Logistic delivery order by id is not implemented yet');
  }

  async processDelivery(orderId: bigint, user: User) {
    throw new NotImplementedException('Logistic process delivery is not implemented yet');
  }
}
