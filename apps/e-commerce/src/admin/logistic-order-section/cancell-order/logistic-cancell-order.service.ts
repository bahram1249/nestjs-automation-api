import { Injectable, NotFoundException } from '@nestjs/common';
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
import { Sequelize, Op } from 'sequelize';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';
import { LogisticUserRoleHandlerService } from 'apps/e-commerce/src/admin/logistic-section/logistic-user-role-handler/logistic-user-role-handler.service';
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
    private readonly logisticAccess: LogisticUserRoleHandlerService,
  ) {}

  async findAll(user: User, filter: GetTotalOrderFilterDto) {
    // restrict by accessible logistics for this user
    const accessibleLogisticIds =
      await this.logisticAccess.listAccessibleLogisticIds(user);

    let qb = this.builder;
    qb = qb
      // cancelled (deleted) orders only
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECLogisticOrder.isDeleted'), 0),
          { [Op.eq]: 1 },
        ),
      )
      .search(filter.search)
      // exclude waiting for payment
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      // ensure order has at least one group in accessible logistics
      .filter(
        Sequelize.literal(
          `EXISTS (
            SELECT 1
              FROM ECLogisticOrderGroupeds LG
             WHERE LG.logisticOrderId = ECLogisticOrder.id
               AND ISNULL(LG.isDeleted,0)=0
               AND LG.logisticId IN (${(accessibleLogisticIds && accessibleLogisticIds.length ? accessibleLogisticIds : [-1]).join(',')})
          )`.replace(/\s\s+/g, ' '),
        ),
      )
      .includeUser();

    // Apply phone number filter ONLY when it is actually provided by the client.
    // DTO defaults it to '%%' when not provided, which should be ignored here.
    const hasPhoneFilter = !!filter.phoneNumber && filter.phoneNumber !== '%%';
    if (hasPhoneFilter) {
      qb = qb.filter(
        Sequelize.where(Sequelize.col('user.phoneNumber'), {
          [Op.like]: filter.phoneNumber,
        }),
      );
    }

    if (filter.orderId) {
      qb = qb.addOrderId(filter.orderId as any);
    }

    const count = await this.repository.count(qb.build());

    qb = qb
      .subQuery(true)
      .includeGroupsAndDetailsRestricted(accessibleLogisticIds)
      .includeAddress()
      .includeUser()
      .includeOrderStatus()
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    let result = await this.repository.findAll(qb.build());
    result = await this.utilService.recalculateOrdersPrices(result);
    return { result, total: count };
  }

  async findById(id: bigint, user: User) {
    const accessibleLogisticIds =
      await this.logisticAccess.listAccessibleLogisticIds(user);

    let qb = this.builder;
    qb = qb
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECLogisticOrder.isDeleted'), 0),
          { [Op.eq]: 1 },
        ),
      )
      .addOrderId(id)
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .filter(
        Sequelize.literal(
          `EXISTS (
            SELECT 1
              FROM ECLogisticOrderGroupeds LG
             WHERE LG.logisticOrderId = ECLogisticOrder.id
               AND ISNULL(LG.isDeleted,0)=0
               AND LG.logisticId IN (${(accessibleLogisticIds && accessibleLogisticIds.length ? accessibleLogisticIds : [-1]).join(',')})
          )`.replace(/\s\s+/g, ' '),
        ),
      )
      .includeGroupsAndDetailsRestricted(accessibleLogisticIds)
      .includeAddress()
      .includeUser()
      .includeOrderStatus();

    let result = await this.repository.findOne(qb.build());
    if (!result) {
      throw new NotFoundException('logistic cancell order not found');
    }
    result = await this.utilService.recalculateOrderPrices(result);
    return { result };
  }
}
