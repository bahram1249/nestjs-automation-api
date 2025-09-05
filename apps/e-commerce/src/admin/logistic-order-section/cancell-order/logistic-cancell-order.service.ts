import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECPayment,
  ECPaymentGateway,
  ECOrderStatus,
} from '@rahino/localdatabase/models';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';
import { GetTotalOrderFilterDto } from 'apps/e-commerce/src/admin/order-section/cancell-order/dto/get-total-order.dto';

@Injectable()
export class LogisticCancellOrderService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly repository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly detailRepository: typeof ECLogisticOrderGroupedDetail,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECPaymentGateway)
    private readonly gatewayRepository: typeof ECPaymentGateway,
    @InjectModel(ECOrderStatus)
    private readonly orderStatusRepository: typeof ECOrderStatus,
    private readonly builder: LogisticOrderQueryBuilder,
    private readonly utilService: LogisticOrderUtilService,
  ) {}

  async findAll(user: User, filter: GetTotalOrderFilterDto) {
    throw new NotImplementedException('Logistic cancell orders list is not implemented yet');
  }

  async findById(id: bigint, user: User) {
    throw new NotImplementedException('Logistic cancell order by id is not implemented yet');
  }
}
