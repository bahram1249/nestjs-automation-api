import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
} from '@rahino/localdatabase/models';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';
import { ListFilter } from '@rahino/query-filter';
import { PostProcessDto } from 'apps/e-commerce/src/admin/order-section/postageOrder/dto';
import { LogisticEcommerceSmsService } from '../../../client/shopping-section/based-logistic/sms/logistic-ecommerce-sms.service';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';
import { LogisticUserRoleHandlerService } from 'apps/e-commerce/src/admin/logistic-section/logistic-user-role-handler/logistic-user-role-handler.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Op } from 'sequelize';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';

@Injectable()
export class LogisticPostageOrderService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly repository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectConnection()
    private readonly sequelize: Sequelize,
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
      .filter(
        Sequelize.literal(
          `EXISTS (
            SELECT 1
              FROM ECLogisticOrderGroupeds LG
             WHERE LG.logisticOrderId = ECLogisticOrder.id
               AND ISNULL(LG.isDeleted,0)=0
               AND LG.orderStatusId = ${OrderStatusEnum.OrderHasBeenProcessed}
               AND LG.orderShipmentWayId = ${OrderShipmentwayEnum.post}
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

    // compute accessible logistic ids and restrict included groups with the same conditions
    const accessibleLogisticIds =
      await this.logisticAccess.listAccessibleLogisticIds(user);

    qb = qb
      .subQuery(true)
      .includeGroupsAndDetailsGroupFiltered({
        logisticIds: accessibleLogisticIds as any,
        orderStatusIds: [OrderStatusEnum.OrderHasBeenProcessed] as any,
        orderShipmentWayId: OrderShipmentwayEnum.post as any,
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
               AND LG.orderStatusId = ${OrderStatusEnum.OrderHasBeenProcessed}
               AND LG.orderShipmentWayId = ${OrderShipmentwayEnum.post}
               AND EXISTS (
                 SELECT 1 FROM ECLogisticUsers LU
                  WHERE LU.userId = ${user.id}
                    AND LU.logisticId = LG.logisticId
                    AND ISNULL(LU.isDeleted,0)=0
               )
          )`.replace(/\s\s+/g, ' '),
        ),
      )
      // restrict included groups to the ones the user can access and match group conditions
      .includeGroupsAndDetailsGroupFiltered({
        logisticIds: (await this.logisticAccess.listAccessibleLogisticIds(
          user,
        )) as any,
        orderStatusIds: [OrderStatusEnum.OrderHasBeenProcessed] as any,
        orderShipmentWayId: OrderShipmentwayEnum.post as any,
      })
      .includeAddress()
      .includeUser();

    let result = await this.repository.findOne(qb.build());
    if (!result) {
      throw new NotFoundException(
        this.localizationService.translate(
          'ecommerce.logistic_order_not_found',
        ),
      );
    }
    result = await this.utilService.recalculateOrderPrices(result);
    return { result };
  }

  async processPost(groupId: bigint, user: User, dto: PostProcessDto) {
    const transaction = await this.sequelize.transaction();
    try {
      let group = await this.groupedRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: groupId })
          .filter({ orderStatusId: OrderStatusEnum.OrderHasBeenProcessed })
          .filter({ orderShipmentWayId: OrderShipmentwayEnum.post as any })
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
        throw new NotFoundException(
          this.localizationService.translate(
            'ecommerce.logistic_group_not_found',
          ),
        );
      }

      await this.logisticAccess.checkAccessToLogistic({
        user,
        logisticId: group.logisticId,
      });

      group.orderStatusId = OrderStatusEnum.SendByPost;
      // set new group-level fields
      group.postReceipt = dto.postReceipt as any;
      group.deliveryDate = new Date();
      group = await group.save({ transaction });
      // roll-up parent ECLogisticOrder status after group status change
      await this.utilService.syncParentOrderStatus(
        group.logisticOrderId as any,
        transaction as any,
      );

      await transaction.commit();

      const order = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: group.logisticOrderId })
          .include([{ model: User, as: 'user' }])
          .build(),
      );
      if (order && (order as any).user) {
        await this.smsService.sendByPost(
          `${(order as any).user.firstname};${(order as any).user.lastname};اداره پست;${dto.postReceipt}`,
          (order as any).user.phoneNumber,
        );
      }

      return { result: group };
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
}
