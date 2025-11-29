import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction, Op } from 'sequelize';
import { User } from '@rahino/database';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
  ECLogisticOrderGroupedDetail,
  ECOrderStatus,
  ECLogisticShipmentWay,
  ECPayment,
  ECPaymentGateway,
} from '@rahino/localdatabase/models';
import { LogisticOrderQueryBuilder } from '../../../client/order-section/utilLogisticOrder/logistic-order-query-builder.service';
import { LogisticOrderUtilService } from '../../../client/order-section/utilLogisticOrder/logistic-order-util.service';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';
import { RoleUtilService } from '@rahino/core/user/role-util/role-util.service';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GetTotalOrderFilterDto } from 'apps/e-commerce/src/admin/order-section/totalOrders/dto/get-total-order.dto';
import {
  ChangeOrderStatusDto,
  EditReceiptPostDto,
} from 'apps/e-commerce/src/admin/order-section/totalOrders/dto';
import { LocalizationService } from 'apps/main/src/common/localization/localization.service';
import { LogisticFinalizedPaymentService } from '../../../client/shopping-section/based-logistic/payment/util/finalized-payment/logistic-finalized-payment.service';
import { LogisticSnapPayService } from '../../../client/shopping-section/based-logistic/payment/provider/services/logistic-snap-pay.service';
import { ChangeShipmentWayDto } from './dto';
@Injectable()
export class LogisticTotalOrderService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly repository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupedRepository: typeof ECLogisticOrderGrouped,
    @InjectModel(ECLogisticOrderGroupedDetail)
    private readonly detailRepository: typeof ECLogisticOrderGroupedDetail,
    @InjectModel(ECOrderStatus)
    private readonly orderStatusRepository: typeof ECOrderStatus,
    @InjectModel(ECLogisticShipmentWay)
    private readonly logisticShipmentWayRepository: typeof ECLogisticShipmentWay,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECPaymentGateway)
    private readonly paymentGatewayRepository: typeof ECPaymentGateway,

    private readonly builder: LogisticOrderQueryBuilder,
    private readonly utilService: LogisticOrderUtilService,
    private readonly roleUtilService: RoleUtilService,
    private readonly userVendorService: UserVendorService,
    private readonly localizationService: LocalizationService,
    private readonly finalizedPaymentService: LogisticFinalizedPaymentService,
    private readonly snapPayService: LogisticSnapPayService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(user: User, filter: GetTotalOrderFilterDto) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);
    const vendorIds = await this.userVendorService.findVendorIds(user);

    let qb = this.builder
      .nonDeletedOrder()
      .search(filter.search)
      .includeUser()
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment);

    // phone filter
    if (filter.phoneNumber) {
      qb = qb.filter(
        Sequelize.literal(
          `EXISTS (SELECT 1 FROM Users U WHERE U.id = ECLogisticOrder.userId AND U.phoneNumber LIKE '${filter.phoneNumber}')`,
        ),
      );
    }

    // orderId filter
    if (filter.orderId) {
      qb = qb.addOrderId(filter.orderId as any);
    }

    // vendor restriction for non super admin
    if (!isSuperAdmin) {
      if (!vendorIds || vendorIds.length === 0) {
        return { result: [], total: 0 };
      }
      const vendorList = vendorIds.join(',');
      qb = qb.filter(
        Sequelize.literal(
          `EXISTS (SELECT 1
             FROM ECLogisticOrderGroupeds LG
             JOIN ECLogisticOrderGroupedDetails LGD ON LGD.groupedId = LG.id
            WHERE LG.logisticOrderId = ECLogisticOrder.id
              AND ISNULL(LG.isDeleted,0)=0
              AND ISNULL(LGD.isDeleted,0)=0
              AND LGD.vendorId IN (${vendorList}))`.replace(/\s\s+/g, ' '),
        ),
      );
    }

    const count = await this.repository.count(qb.build());

    qb = qb.subQuery(true);
    qb = !isSuperAdmin
      ? qb.includeGroupsAndDetailsVendorRestricted(vendorIds as any)
      : qb.includeGroupsAndDetails();
    qb = qb
      .includeAddress()
      .includeUser()
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    let result = await this.repository.findAll(qb.build());
    result = await this.utilService.recalculateOrdersPrices(result);
    return { result, total: count };
  }

  async findById(entityId: bigint, user: User) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);
    const vendorIds = await this.userVendorService.findVendorIds(user);

    let qb = this.builder
      .nonDeletedOrder()
      .addOrderId(entityId)
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .includeAddress()
      .includeUser();

    if (!isSuperAdmin) {
      if (!vendorIds || vendorIds.length === 0) {
        throw new NotFoundException(
          this.localizationService.translate(
            'ecommerce.logistic_order_not_found',
          ),
        );
      }
      const vendorList = vendorIds.join(',');
      qb = qb.filter(
        Sequelize.literal(
          `EXISTS (SELECT 1
             FROM ECLogisticOrderGroupeds LG
             JOIN ECLogisticOrderGroupedDetails LGD ON LGD.groupedId = LG.id
            WHERE LG.logisticOrderId = ECLogisticOrder.id
              AND ISNULL(LG.isDeleted,0)=0
              AND ISNULL(LGD.isDeleted,0)=0
              AND LGD.vendorId IN (${vendorList}))`.replace(/\s\s+/g, ' '),
        ),
      );
    }

    qb = !isSuperAdmin
      ? qb.includeGroupsAndDetailsVendorRestricted(vendorIds as any)
      : qb.includeGroupsAndDetails();

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

  async removeById(id: bigint) {
    const transaction = await this.sequelize.transaction();
    try {
      const item = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({ id })
          .filter({
            orderStatusId: { [Op.ne]: OrderStatusEnum.WaitingForPayment },
          })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECLogisticOrder.isDeleted'),
                0,
              ),
              { [Op.eq]: 0 },
            ),
          )
          .transaction(transaction)
          .build(),
      );
      if (!item) {
        throw new NotFoundException(
          this.localizationService.translate(
            'ecommerce.logistic_order_not_found',
          ),
        );
      }

      await this.repository.update(
        { isDeleted: true },
        { where: { id }, transaction },
      );

      // If payment was with SnapPay and is successful, cancel it

      await this.cancelSnapPayIfApplicable(id, transaction);

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
    return { result: 'ok' };
  }

  async removeDetail(detailId: bigint, user: User) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const detail = await this.detailRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: detailId })
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
      if (!detail) {
        throw new NotFoundException(
          this.localizationService.translate(
            'ecommerce.logistic_detail_not_found',
          ),
        );
      }

      // soft delete
      await this.detailRepository.update(
        { isDeleted: true },
        { where: { id: detailId }, transaction },
      );

      await this.recalculateAndUpdateOrderTotals(detail.groupedId, transaction);

      // After totals changed, attempt to update SnapPay payment if gateway is SnapPay
      await this.updateSnapPayIfApplicable(detail.groupedId, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
    return { result: 'ok' };
  }

  async decreaseDetail(detailId: bigint, user: User) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const detail = await this.detailRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: detailId })
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
      if (!detail) {
        throw new NotFoundException(
          this.localizationService.translate(
            'ecommerce.logistic_detail_not_found',
          ),
        );
      }
      if (Number(detail.qty) <= 1) {
        throw new BadRequestException(
          this.localizationService.translate('ecommerce.qty_cannot_decrease'),
        );
      }

      const newQty = Number(detail.qty) - 1;
      await this.detailRepository.update(
        {
          qty: newQty,
          discountFee: Number(detail.discountFeePerItem || 0) * newQty,
          totalPrice:
            Number(detail.productPrice || 0) * newQty -
            Number(detail.discountFeePerItem || 0) * newQty,
        },
        { where: { id: detailId }, transaction },
      );

      await this.recalculateAndUpdateOrderTotals(detail.groupedId, transaction);

      // After totals changed, attempt to update SnapPay payment if gateway is SnapPay
      await this.updateSnapPayIfApplicable(detail.groupedId, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }

    return { result: 'ok' };
  }

  async changeOrderStatus(id: bigint, dto: ChangeOrderStatusDto) {
    const status = await this.orderStatusRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.orderStatusId }).build(),
    );
    if (!status) {
      throw new ForbiddenException(
        this.localizationService.translate('ecommerce.not_permitted'),
      );
    }
    let order = await this.groupedRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
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
        .build(),
    );
    if (!order) {
      throw new NotFoundException(
        this.localizationService.translate(
          'ecommerce.logistic_order_not_found',
        ),
      );
    }
    order.orderStatusId = dto.orderStatusId;
    order = await order.save();
    return { result: order };
  }

  // In logistic flow, id is the groupId
  async changeShipmentWay(groupId: bigint, dto: ChangeShipmentWayDto) {
    let group = await this.groupedRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: groupId })
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
        .build(),
    );
    if (!group) {
      throw new NotFoundException(
        this.localizationService.translate(
          'ecommerce.logistic_group_not_found',
        ),
      );
    }

    // also update cached order-shipment-way (delivery/post/etc.) to simplify downstream filters
    group.orderShipmentWayId = dto.orderShipmentWayId;
    group = await group.save();
    return { result: group };
  }

  // In logistic flow id is groupId
  async editReceiptPost(id: bigint, dto: EditReceiptPostDto) {
    let group = await this.groupedRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
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
        .build(),
    );
    if (!group) {
      throw new NotFoundException(
        this.localizationService.translate(
          'ecommerce.logistic_group_not_found',
        ),
      );
    }
    group.postReceipt = (dto as any).receipt;
    group = await group.save();
    return { result: group };
  }

  private async recalculateAndUpdateOrderTotals(
    groupId: bigint,
    transaction?: Transaction,
  ) {
    const group = await this.groupedRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: groupId })
        .transaction(transaction)
        .build(),
    );
    if (!group) return;
    const orderId = group.logisticOrderId;

    // sum details
    const qbDetails = new QueryOptionsBuilder()
      .attributes([
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.literal(
                'ECLogisticOrderGroupedDetail.productPrice * ECLogisticOrderGroupedDetail.qty',
              ),
            ),
            0,
          ),
          'productPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.literal(
                'ECLogisticOrderGroupedDetail.discountFeePerItem * ECLogisticOrderGroupedDetail.qty',
              ),
            ),
            0,
          ),
          'discountFee',
        ],
      ])
      .filter(
        Sequelize.literal(
          `EXISTS (SELECT 1 FROM ECLogisticOrderGroupeds LG WHERE LG.id = ECLogisticOrderGroupedDetail.groupedId AND LG.logisticOrderId = ${orderId} AND ISNULL(LG.isDeleted,0)=0)`,
        ),
      )
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
      .raw(true)
      .transaction(transaction);

    const detailsQuery = qbDetails.build();
    detailsQuery.limit = null as any;
    detailsQuery.offset = null as any;
    detailsQuery.order = null as any;
    detailsQuery.subQuery = false as any;

    const totals: any = await this.detailRepository.findOne(detailsQuery);

    // sum shipments (groups)
    const qbShipment = new QueryOptionsBuilder()
      .attributes([
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn('sum', Sequelize.col('shipmentPrice')),
            0,
          ),
          'shipmentPrice',
        ],
      ])
      .filter({ logisticOrderId: orderId })
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
      .raw(true)
      .transaction(transaction);

    const shipmentQuery = qbShipment.build();
    shipmentQuery.limit = null as any;
    shipmentQuery.offset = null as any;
    shipmentQuery.order = null as any;
    shipmentQuery.subQuery = false as any;

    const shipmentTotals: any =
      await this.groupedRepository.findOne(shipmentQuery);

    const totalProductPrice = Number(totals?.productPrice || 0);
    const totalDiscountFee = Number(totals?.discountFee || 0);
    const totalShipmentPrice = Number(shipmentTotals?.shipmentPrice || 0);

    await this.repository.update(
      {
        totalProductPrice: totalProductPrice as any,
        totalDiscountFee: totalDiscountFee as any,
        totalShipmentPrice: totalShipmentPrice as any,
        totalPrice: (totalProductPrice -
          totalDiscountFee +
          totalShipmentPrice) as any,
      },
      { where: { id: orderId }, transaction },
    );

    // Recalculate group totals for the affected group
    const qbGroupDetails = new QueryOptionsBuilder()
      .attributes([
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.literal(
                'ECLogisticOrderGroupedDetail.productPrice * ECLogisticOrderGroupedDetail.qty',
              ),
            ),
            0,
          ),
          'productPrice',
        ],
        [
          Sequelize.fn(
            'isnull',
            Sequelize.fn(
              'sum',
              Sequelize.literal(
                'ECLogisticOrderGroupedDetail.discountFeePerItem * ECLogisticOrderGroupedDetail.qty',
              ),
            ),
            0,
          ),
          'discountFee',
        ],
      ])
      .filter({ groupedId: groupId })
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
      .raw(true)
      .transaction(transaction);

    const groupQuery = qbGroupDetails.build();
    groupQuery.limit = null as any;
    groupQuery.offset = null as any;
    groupQuery.order = null as any;
    groupQuery.subQuery = false as any;

    const groupTotals: any = await this.detailRepository.findOne(groupQuery);

    const gProd = Number(groupTotals?.productPrice || 0);
    const gDisc = Number(groupTotals?.discountFee || 0);
    const gShip = Number(group?.shipmentPrice || 0);
    await this.groupedRepository.update(
      {
        totalProductPrice: gProd as any,
        totalDiscountFee: gDisc as any,
        totalPrice: (gProd - gDisc + gShip) as any,
      },
      { where: { id: groupId }, transaction },
    );

    // Apply payment gateway commission after totals update
    await this.finalizedPaymentService.applyPaymentGatewayCommisssion(
      orderId as any,
      transaction,
    );
  }

  private async updateSnapPayIfApplicable(
    groupId: bigint,
    transaction?: Transaction,
  ) {
    // find parent order, its user, and active details to build cart
    const group = await this.groupedRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: groupId })
        .transaction(transaction)
        .build(),
    );
    if (!group) return;

    const qb = new QueryOptionsBuilder()
      .filter({ id: group.logisticOrderId })
      .transaction(transaction)
      .include([
        { model: ECLogisticOrderGrouped as any, as: 'groups', required: false },
        { model: User as any, as: 'user', required: false },
      ]);
    const order = await this.repository.findOne(qb.build());
    if (!order) return;

    // check gateway is SnapPay
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .transaction(transaction)
        .filter({ logisticOrderId: order.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECPayment.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .build(),
    );
    if (!payment) return; // nothing to update/cancel
    const gateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .transaction(transaction)
        .filter({ id: payment.paymentGatewayId })
        .build(),
    );
    if (!gateway || gateway.serviceName !== 'SnapPayService') return;

    // load non-deleted grouped details for cart items
    const groupedDetails = await this.detailRepository.findAll(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.literal(
            `EXISTS (SELECT 1 FROM ECLogisticOrderGroupeds LG WHERE LG.id = ECLogisticOrderGroupedDetail.groupedId AND LG.logisticOrderId = ${order.id} AND ISNULL(LG.isDeleted,0)=0)`,
          ),
        )
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

    const totalPrice = Number(order.totalPrice || 0);
    const discountAmount = Number(order.totalDiscountFee || 0);
    const shipmentAmount = Number(order.totalShipmentPrice || 0);
    const phone = (order as any)?.user?.phoneNumber || '';

    // if there is no detail anymore, cancel the payment
    if (!groupedDetails || groupedDetails.length === 0) {
      await this.snapPayService.cancel(order.id as any, transaction);
      return;
    }

    await this.snapPayService.update(
      totalPrice,
      discountAmount,
      shipmentAmount,
      phone,
      transaction,
      order.id as any,
      groupedDetails,
    );
  }

  private async cancelSnapPayIfApplicable(
    orderId: bigint,
    transaction?: Transaction,
  ) {
    const payment = await this.paymentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ logisticOrderId: orderId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECPayment.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .transaction(transaction)
        .build(),
    );
    if (!payment) return;

    const gateway = await this.paymentGatewayRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: payment.paymentGatewayId })
        .transaction(transaction)
        .build(),
    );
    if (!gateway || gateway.serviceName !== 'SnapPayService') return;

    await this.snapPayService.cancel(orderId, transaction);
  }
}
