import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import {
  ECLogisticOrder,
  ECCourier,
  ECLogisticOrderGrouped,
} from '@rahino/localdatabase/models';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Op } from 'sequelize';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { RoleUtilService } from '@rahino/core/user/role-util/role-util.service';

@Injectable()
export class LogisticDeliveryOrderService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly repository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECCourier)
    private readonly courierRepository: typeof ECCourier,
    private readonly builder: LogisticOrderQueryBuilder,
    private readonly utilService: LogisticOrderUtilService,
    private readonly roleUtilService: RoleUtilService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);

    let qb = this.builder;
    qb = qb
      .nonDeletedOrder()
      .search(filter.search)
      .filter(
        Sequelize.literal(
          `EXISTS (
            SELECT 1
              FROM ECLogisticOrderGroupeds LG
             WHERE LG.logisticOrderId = ECLogisticOrder.id
               AND ISNULL(LG.isDeleted,0)=0
               AND LG.orderStatusId = ${OrderStatusEnum.SendByCourier}
               AND LG.orderShipmentWayId = ${OrderShipmentwayEnum.delivery}
               ${isSuperAdmin ? '' : `AND ISNULL(LG.courierUserId,0) = ${user.id}`}
          )`.replace(/\s\s+/g, ' '),
        ),
      );

    const count = await this.repository.count(qb.build());

    qb = qb
      .subQuery(true)
      .includeGroupsAndDetailsGroupFiltered({
        orderStatusIds: [OrderStatusEnum.SendByCourier] as any,
        orderShipmentWayId: OrderShipmentwayEnum.delivery as any,
        ...(isSuperAdmin ? {} : { courierUserId: user.id as any }),
      })
      .includeAddress()
      .includeUser()
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    let result = await this.repository.findAll(qb.build());
    result = await this.utilService.recalculateOrdersPrices(result);
    return { result, total: count };
  }

  async findById(id: bigint, user: User) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);

    let qb = this.builder;
    qb = qb
      .nonDeletedOrder()
      .addOrderId(id)
      .filter(
        Sequelize.literal(
          `EXISTS (
            SELECT 1
              FROM ECLogisticOrderGroupeds LG
             WHERE LG.logisticOrderId = ECLogisticOrder.id
               AND ISNULL(LG.isDeleted,0)=0
               AND LG.orderStatusId = ${OrderStatusEnum.SendByCourier}
               AND LG.orderShipmentWayId = ${OrderShipmentwayEnum.delivery}
               ${isSuperAdmin ? '' : `AND ISNULL(LG.courierUserId,0) = ${user.id}`}
          )`.replace(/\s\s+/g, ' '),
        ),
      )
      .includeGroupsAndDetailsGroupFiltered({
        orderStatusIds: [OrderStatusEnum.SendByCourier] as any,
        orderShipmentWayId: OrderShipmentwayEnum.delivery as any,
        ...(isSuperAdmin ? {} : { courierUserId: user.id as any }),
      })
      .includeAddress()
      .includeUser();

    let result = await this.repository.findOne(qb.build());
    if (!result) {
      throw new NotFoundException('logistic delivery order not found');
    }
    result = await this.utilService.recalculateOrderPrices(result);
    return { result };
  }

  // Here id is treated as groupId in logistic flow
  async processDelivery(groupId: bigint, user: User) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);
    const transaction = await this.sequelize.transaction();
    try {
      let group = await this.groupedRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: groupId })
          .filter({ orderStatusId: OrderStatusEnum.SendByCourier })
          .filter({ orderShipmentWayId: OrderShipmentwayEnum.delivery as any })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECLogisticOrderGrouped.isDeleted'),
                0,
              ),
              { [Op.eq]: 0 },
            ),
          )
          .transaction(transaction)
          .build(),
      );
      if (!group) {
        throw new NotFoundException('logistic group not found');
      }

      if (
        !isSuperAdmin &&
        Number(group.courierUserId || 0) !== Number(user.id)
      ) {
        throw new NotFoundException('logistic group not found');
      }

      group.orderStatusId = OrderStatusEnum.DeliveredToTheCustomer;
      group.sendToCustomerDate = new Date();
      group.sendToCustomerBy = user.id as any;
      group = await group.save({ transaction });
      // roll-up parent order status
      // Delivered group may finalize order delivered status
      // However, sync method will compute proper parent status
      await this.utilService.syncParentOrderStatus(
        group.logisticOrderId as any,
        transaction as any,
      );

      await transaction.commit();
      return { result: group };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
