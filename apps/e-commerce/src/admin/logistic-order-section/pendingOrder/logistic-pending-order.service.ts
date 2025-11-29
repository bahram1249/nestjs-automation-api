import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
} from '@rahino/localdatabase/models';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';
import { GetOrderDto } from 'apps/e-commerce/src/admin/order-section/pendingOrder/dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize, Op } from 'sequelize';
import {
  OrderDetailStatusEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';

@Injectable()
export class LogisticPendingOrderService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly repository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly detailRepository: typeof ECLogisticOrderGroupedDetail,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly builder: LogisticOrderQueryBuilder,
    private readonly utilService: LogisticOrderUtilService,
    private readonly userVendorService: UserVendorService,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(user: User, filter: GetOrderDto) {
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      filter.vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException(
        this.localizationService.translate(
          'ecommerce.dont_access_to_this_vendor',
        ),
      );
    }

    let qb = this.builder;
    qb = qb
      .nonDeletedOrder()
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .search(filter.search);

    // Filter orders that have at least one pending detail for this vendor in any group
    qb = qb.filter(
      Sequelize.literal(
        `EXISTS (SELECT 1
           FROM ECLogisticOrderGroupeds LG
           JOIN ECLogisticOrderGroupedDetails LGD ON LGD.groupedId = LG.id
          WHERE LG.logisticOrderId = ECLogisticOrder.id
            AND ISNULL(LG.isDeleted,0)=0
            AND ISNULL(LGD.isDeleted,0)=0
            AND LGD.vendorId = ${filter.vendorId}
            AND LG.orderStatusId = ${OrderStatusEnum.Paid}
            AND LGD.orderDetailStatusId = ${OrderDetailStatusEnum.WaitingForProcess})`,
      ),
    );

    const count = await this.repository.count(qb.build());

    qb = qb
      .subQuery(true)
      .includeGroupsAndDetailsVendorAndStatusRestricted(
        [filter.vendorId],
        //[OrderDetailStatusEnum.WaitingForProcess],
      )
      .includeAddress()
      .includeUser()
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    let result = await this.repository.findAll(qb.build());
    result = await this.utilService.recalculateOrdersPrices(result);
    return { result, total: count };
  }

  async findById(entityId: bigint, user: User, filter: GetOrderDto) {
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      filter.vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException(
        this.localizationService.translate(
          'ecommerce.dont_access_to_this_vendor',
        ),
      );
    }

    let qb = this.builder;
    qb = qb
      .nonDeletedOrder()
      .addOrderId(entityId)
      .filter(
        Sequelize.literal(
          `EXISTS (SELECT 1
             FROM ECLogisticOrderGroupeds LG
             JOIN ECLogisticOrderGroupedDetails LGD ON LGD.groupedId = LG.id
            WHERE LG.logisticOrderId = ECLogisticOrder.id
              AND ISNULL(LG.isDeleted,0)=0
              AND ISNULL(LGD.isDeleted,0)=0
              AND LGD.vendorId = ${filter.vendorId}
              AND LGD.orderDetailStatusId = ${OrderDetailStatusEnum.WaitingForProcess})`,
        ),
      )
      .includeGroupsAndDetailsVendorAndStatusRestricted(
        [filter.vendorId],
        [OrderDetailStatusEnum.WaitingForProcess],
      )
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

  async processDetail(detailId: bigint, user: User) {
    // find pending detail
    const detail = await this.detailRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: detailId })
        .filter({
          orderDetailStatusId: OrderDetailStatusEnum.WaitingForProcess,
        })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECLogisticOrderGroupedDetail.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    if (!detail) {
      throw new NotFoundException(
        this.localizationService.translate(
          'ecommerce.logistic_detail_not_found',
        ),
      );
    }

    // vendor access
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      detail.vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException(
        this.localizationService.translate(
          'ecommerce.dont_access_to_this_vendor',
        ),
      );
    }

    const transaction = await this.sequelize.transaction();
    try {
      // mark processed
      detail.orderDetailStatusId = OrderDetailStatusEnum.Processed;
      await detail.save({ transaction });

      // check other pending in same group
      const another = await this.detailRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ groupedId: detail.groupedId })
          .filter({
            orderDetailStatusId: { [Op.ne]: OrderDetailStatusEnum.Processed },
          })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECLogisticOrderGroupedDetail.isDeleted'),
                0,
              ),
              { [Op.eq]: 0 },
            ),
          )
          .transaction(transaction)
          .build(),
      );

      if (!another) {
        // move group to processed
        const group = await this.groupedRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ id: detail.groupedId })
            .transaction(transaction)
            .build(),
        );
        if (group) {
          group.orderStatusId = OrderStatusEnum.OrderHasBeenProcessed;
          await group.save({ transaction });
          // roll-up parent ECLogisticOrder status after group status change
          await this.utilService.syncParentOrderStatus(
            group.logisticOrderId as any,
            transaction as any,
          );
        }
        // TODO: optional SMS when group processed
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }

    return { result: detail };
  }
}
