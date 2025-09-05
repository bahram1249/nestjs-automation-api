import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECLogisticOrder, ECCourier, ECLogisticOrderGrouped } from '@rahino/localdatabase/models';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';
import { ListFilter } from '@rahino/query-filter';
import { CourierProcessDto } from 'apps/e-commerce/src/admin/order-section/courierOrder/dto';
import { LogisticEcommerceSmsService } from '../../../client/shopping-section/based-logistic/sms/logistic-ecommerce-sms.service';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';
import { LogisticUserRoleHandlerService } from 'apps/e-commerce/src/admin/logistic-section/logistic-user-role-handler/logistic-user-role-handler.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Op } from 'sequelize';
import { OrderShipmentwayEnum, OrderStatusEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class LogisticCourierOrderService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly repository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECCourier)
    private readonly courierRepository: typeof ECCourier,
    private readonly builder: LogisticOrderQueryBuilder,
    private readonly utilService: LogisticOrderUtilService,
    private readonly smsService: LogisticEcommerceSmsService,
    private readonly localizationService: LocalizationService,
    private readonly logisticAccess: LogisticUserRoleHandlerService,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    let qb = this.builder;
    qb = qb
      .nonDeletedOrder()
      .search(filter.search)
      // Orders having at least one group processed and shipment way = delivery and accessible logistic by user
      .filter(
        Sequelize.literal(
          `EXISTS (
            SELECT 1
              FROM ECLogisticOrderGroupeds LG
              JOIN ECLogisticShipmentWays LSW ON LSW.id = LG.logisticShipmentWayId AND LSW.orderShipmentWayId = ${OrderShipmentwayEnum.delivery}
             WHERE LG.logisticOrderId = ECLogisticOrder.id
               AND ISNULL(LG.isDeleted,0)=0
               AND LG.orderStatusId = ${OrderStatusEnum.OrderHasBeenProcessed}
               AND EXISTS (
                 SELECT 1 FROM ECLogisticUsers LU
                  WHERE LU.userId = ${user.id}
                    AND LU.logisticId = LG.logisticId
                    AND ISNULL(LU.isDeleted,0)=0
               )
          )`.replace(/\s\s+/g, ' '),
        ),
      );

    const count = await this.repository.count(qb.build());

    qb = qb
      .subQuery(true)
      .includeGroupsAndDetails()
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
    let qb = this.builder;
    qb = qb
      .nonDeletedOrder()
      .addOrderId(id)
      .filter(
        Sequelize.literal(
          `EXISTS (
            SELECT 1
              FROM ECLogisticOrderGroupeds LG
              JOIN ECLogisticShipmentWays LSW ON LSW.id = LG.logisticShipmentWayId AND LSW.orderShipmentWayId = ${OrderShipmentwayEnum.delivery}
             WHERE LG.logisticOrderId = ECLogisticOrder.id
               AND ISNULL(LG.isDeleted,0)=0
               AND LG.orderStatusId = ${OrderStatusEnum.OrderHasBeenProcessed}
               AND EXISTS (
                 SELECT 1 FROM ECLogisticUsers LU
                  WHERE LU.userId = ${user.id}
                    AND LU.logisticId = LG.logisticId
                    AND ISNULL(LU.isDeleted,0)=0
               )
          )`.replace(/\s\s+/g, ' '),
        ),
      )
      .includeGroupsAndDetails()
      .includeAddress()
      .includeUser();

    let result = await this.repository.findOne(qb.build());
    if (!result) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.logistic_order_not_found'),
      );
    }
    result = await this.utilService.recalculateOrderPrices(result);
    return { result };
  }

  // Here id is treated as groupId in logistic flow
  async processCourier(groupId: bigint, user: User, dto: CourierProcessDto) {
    // find group eligible for courier
    let group = await this.groupedRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: groupId })
        .filter({ orderStatusId: OrderStatusEnum.OrderHasBeenProcessed })
        .filter(
          Sequelize.literal(
            `EXISTS (SELECT 1 FROM ECLogisticShipmentWays LSW WHERE LSW.id = ECLogisticOrderGrouped.logisticShipmentWayId AND LSW.orderShipmentWayId = ${OrderShipmentwayEnum.delivery})`,
          ),
        )
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECLogisticOrderGrouped.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    if (!group) {
      throw new NotFoundException(
        this.localizationService.translate('ecommerce.logistic_group_not_found'),
      );
    }

    // access check to logistic
    await this.logisticAccess.checkAccessToLogistic({ user, logisticId: group.logisticId });

    // validate courier user exists
    const courier = await this.courierRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: dto.userId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECCourier.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    if (!courier) {
      throw new NotFoundException(this.localizationService.translate('ecommerce.courier_not_found'));
    }

    // update group status
    group.orderStatusId = OrderStatusEnum.SendByCourier;
    group = await group.save();

    // SMS (no storage for courierUserId at group-level in current model)
    // To send SMS we need order's user phone; fetch parent order with user
    const order = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: group.logisticOrderId })
        .include([{ model: User, as: 'user' }])
        .build(),
    );
    if (order && (order as any).user) {
      await this.smsService.sendByCourier(
        `${(order as any).user.firstname};${(order as any).user.lastname};${courier.userId};${groupId}`,
        (order as any).user.phoneNumber,
      );
    }

    return { result: group };
  }
}
