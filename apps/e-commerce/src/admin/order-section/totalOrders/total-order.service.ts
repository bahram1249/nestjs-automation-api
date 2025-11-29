import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';
import { OrderQueryBuilder } from '../utilOrder/service/order-query-builder.service';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { Sequelize, Transaction } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { SnapPayService } from '@rahino/ecommerce/user/shopping/payment/provider/services';
import { ECProduct } from '@rahino/localdatabase/models';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { RoleUtilService } from '@rahino/core/user/role-util/role-util.service';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { OrderUtilService } from '../utilOrder/service/order-util.service';
import { FinalizedPaymentService } from '@rahino/ecommerce/user/shopping/payment/util/finalized-payment/finalized-payment.service';
import {
  ChangeOrderStatusDto,
  ChangeShipmentWayDto,
  EditReceiptPostDto,
} from './dto';
import { ECOrderStatus } from '@rahino/localdatabase/models';
import { ECOrderShipmentWay } from '@rahino/localdatabase/models';
import { GetTotalOrderFilterDto } from './dto/get-total-order.dto';

@Injectable()
export class TotalOrderService {
  constructor(
    @InjectModel(ECOrder)
    private readonly repository: typeof ECOrder,
    @InjectModel(ECOrderDetail)
    private readonly orderDetailRepository: typeof ECOrderDetail,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    @InjectModel(ECPayment)
    private readonly paymentRepository: typeof ECPayment,
    @InjectModel(ECPaymentGateway)
    private readonly paymentGatewayRepository: typeof ECPaymentGateway,
    @InjectModel(ECOrderStatus)
    private readonly orderStatusRepository: typeof ECOrderStatus,
    @InjectModel(ECOrderShipmentWay)
    private readonly orderShipmentWayRepository: typeof ECOrderShipmentWay,

    private orderQueryBuilder: OrderQueryBuilder,
    private readonly snapPayService: SnapPayService,
    private readonly roleUtilService: RoleUtilService,
    private readonly userVendorService: UserVendorService,
    private readonly orderUtilService: OrderUtilService,
    private readonly finalizedPaymentService: FinalizedPaymentService,
  ) {}

  async findAll(user: User, filter: GetTotalOrderFilterDto) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);
    const vendorIds = await this.userVendorService.findVendorIds(user);

    let builder = this.orderQueryBuilder
      .nonDeletedOrder()
      .search(filter.search)
      .includeUser()
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment);

    if (!isSuperAdmin) {
      builder = builder.addOnlyVendor(vendorIds);
    }

    if (filter.phoneNumber) {
      builder = builder.filterPhoneNumber(filter.phoneNumber);
    }

    if (filter.orderId) {
      builder = builder.filterOrderId(filter.orderId);
    }

    const count = await this.repository.count(builder.build());

    if (isSuperAdmin) {
      builder = builder.includeAdminOrderDetails();
    } else {
      builder = builder.includeAdminOrderDetails(vendorIds);
    }

    builder = builder
      .subQuery(true)
      .includeOrderShipmentWay()
      .includeAddress()
      .includeOrderStatus()
      .offset(filter.offset)
      .limit(filter.limit)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    let result = await this.repository.findAll(builder.build());
    result = await this.orderUtilService.recalculateOrdersPrices(result);

    return {
      result: result,
      total: count,
    };
  }

  async findById(id: bigint, user: User) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);
    const vendorIds = await this.userVendorService.findVendorIds(user);

    let builder = this.orderQueryBuilder;

    if (!isSuperAdmin) {
      builder = builder
        .addOnlyVendor(vendorIds)
        .includeAdminOrderDetails(vendorIds);
    } else {
      builder = builder.includeAdminOrderDetails();
    }

    builder = builder
      .nonDeletedOrder()
      .includeOrderShipmentWay()
      .addOrderId(id)
      .includeOrderStatus()
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .includeAddress()
      .includeUser();

    let result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    result = await this.orderUtilService.recalculateOrderPrices(result);

    return {
      result: result,
    };
  }

  async removeById(id: bigint) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const item = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: id })
          .filter({
            orderStatusId: {
              [Op.ne]: OrderStatusEnum.WaitingForPayment,
            },
          })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      if (!item) {
        throw new NotFoundException('the item with this given id not founded!');
      }

      await this.repository.update(
        { isDeleted: true },
        {
          where: {
            id: id,
          },
          transaction: transaction,
        },
      );

      const payment = await this.paymentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ orderId: item.id })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      const paymentGateway = await this.paymentGatewayRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: payment.paymentGatewayId })
          .build(),
      );
      if (paymentGateway.serviceName == 'SnapPayService') {
        await this.snapPayService.cancel(item.id, transaction);
      }

      await transaction.commit();
    } catch {
      await transaction.rollback();
    }
    return {
      result: 'ok',
    };
  }

  async removeDetail(detailId: bigint, user: User) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const detail = await this.orderDetailRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: detailId })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECOrderDetail.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .transaction(transaction)
          .build(),
      );
      if (!detail) {
        throw new NotFoundException('the item with this given id not founded!');
      }
      await this.orderDetailRepository.update(
        { isDeleted: true },
        {
          where: {
            id: detailId,
          },
          transaction: transaction,
        },
      );
      const queryBulder = new QueryOptionsBuilder()
        .attributes([
          [
            Sequelize.fn(
              'isnull',
              Sequelize.fn(
                'sum',
                Sequelize.literal(
                  'ECOrderDetail.productPrice * ECOrderDetail.qty',
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
                  'ECOrderDetail.discountFeePerItem * ECOrderDetail.qty',
                ),
              ),
              0,
            ),
            'discountFee',
          ],
        ])
        .filter({ orderId: detail.orderId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrderDetail.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .raw(true)
        .transaction(transaction);
      const resultQuery = queryBulder.build();
      resultQuery.limit = null;
      resultQuery.offset = null;
      resultQuery.order = null;
      resultQuery.subQuery = false;
      const totalPrice = await this.orderDetailRepository.findOne(resultQuery);
      const order = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: detail.orderId })
          .transaction(transaction)
          .build(),
      );
      await this.repository.update(
        {
          totalProductPrice: totalPrice.productPrice,
          totalDiscountFee: totalPrice.discountFee,
          totalPrice:
            Number(totalPrice.productPrice) -
            Number(totalPrice.discountFee) +
            Number(order.totalShipmentPrice),
        },
        {
          where: {
            id: detail.orderId,
          },
          transaction: transaction,
        },
      );
      await this.finalizedPaymentService.applyPaymentGatewayCommisssion(
        order.id,
        transaction,
      );

      const payment = await this.paymentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ orderId: detail.orderId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      const paymentGateway = await this.paymentGatewayRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: payment.paymentGatewayId })
          .build(),
      );
      if (paymentGateway.serviceName == 'SnapPayService') {
        const order = await this.repository.findOne(
          new QueryOptionsBuilder()
            .include([
              {
                model: ECOrderDetail,
                as: 'details',
                where: Sequelize.where(
                  Sequelize.fn('isnull', Sequelize.col('details.isDeleted'), 0),
                  {
                    [Op.eq]: 0,
                  },
                ),
                required: false,
                include: [
                  {
                    model: ECProduct,
                    as: 'product',
                    required: false,
                    include: [
                      {
                        model: EAVEntityType,
                        as: 'entityType',
                        required: false,
                      },
                    ],
                  },
                ],
              },
              {
                model: User,
                as: 'user',
                required: false,
              },
            ])
            .filter({ id: detail.orderId })
            .transaction(transaction)
            .build(),
        );
        if (!order) {
          throw new BadRequestException(
            'the order with this given id not founded!',
          );
        }
        await this.snapPayService.update(
          Number(order.totalPrice),
          Number(order.totalDiscountFee),
          Number(order.totalShipmentPrice),
          order.user.phoneNumber,
          transaction,
          order.id,
          order.details,
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(
        'something failed on remove detail order',
      );
    }

    return {
      result: 'ok',
    };
  }

  async decreaseDetail(detailId: bigint, user: User) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      const detail = await this.orderDetailRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: detailId })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECOrderDetail.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .transaction(transaction)
          .build(),
      );
      if (!detail) {
        throw new NotFoundException('the item with this given id not founded!');
      }
      if (detail.qty <= 1) {
        throw new BadRequestException(`the quantity cannot be decrease`);
      }
      const newQty = detail.qty - 1;
      await this.orderDetailRepository.update(
        {
          qty: newQty,
          discountFee: Number(detail.discountFeePerItem) * newQty,
          totalPrice:
            Number(detail.productPrice) * newQty -
            Number(detail.discountFeePerItem) * newQty,
        },
        {
          where: {
            id: detailId,
          },
          transaction: transaction,
        },
      );
      // there is a problem
      const queryBulder = new QueryOptionsBuilder()
        .attributes([
          [
            Sequelize.fn(
              'isnull',
              Sequelize.fn(
                'sum',
                Sequelize.literal(
                  'ECOrderDetail.productPrice * ECOrderDetail.qty',
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
                  'ECOrderDetail.discountFeePerItem * ECOrderDetail.qty',
                ),
              ),
              0,
            ),
            'discountFee',
          ],
        ])
        .filter({ orderId: detail.orderId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrderDetail.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .raw(true)
        .transaction(transaction);
      const resultQuery = queryBulder.build();
      resultQuery.limit = null;
      resultQuery.offset = null;
      resultQuery.order = null;
      resultQuery.subQuery = false;
      const totalPrice = await this.orderDetailRepository.findOne(resultQuery);
      const order = await this.repository.findOne(
        new QueryOptionsBuilder().filter({ id: detail.orderId }).build(),
      );
      await this.repository.update(
        {
          totalProductPrice: totalPrice.productPrice,
          totalDiscountFee: totalPrice.discountFee,
          totalPrice:
            Number(totalPrice.productPrice) -
            Number(totalPrice.discountFee) +
            Number(order.totalShipmentPrice),
        },
        {
          where: {
            id: detail.orderId,
          },
          transaction: transaction,
        },
      );

      const payment = await this.paymentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ orderId: detail.orderId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      const paymentGateway = await this.paymentGatewayRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: payment.paymentGatewayId })
          .build(),
      );
      if (paymentGateway.serviceName == 'SnapPayService') {
        const order = await this.repository.findOne(
          new QueryOptionsBuilder()
            .include([
              {
                model: ECOrderDetail,
                as: 'details',
                where: Sequelize.where(
                  Sequelize.fn('isnull', Sequelize.col('details.isDeleted'), 0),
                  {
                    [Op.eq]: 0,
                  },
                ),
                required: false,
                include: [
                  {
                    model: ECProduct,
                    as: 'product',
                    required: false,
                    include: [
                      {
                        model: EAVEntityType,
                        as: 'entityType',
                        required: false,
                      },
                    ],
                  },
                ],
              },
              {
                model: User,
                as: 'user',
                required: false,
              },
            ])
            .filter({ id: detail.orderId })
            .transaction(transaction)
            .build(),
        );
        if (!order) {
          throw new BadRequestException(
            'the order with this given id not founded!',
          );
        }
        await this.snapPayService.update(
          Number(order.totalPrice),
          Number(order.totalDiscountFee),
          Number(order.totalShipmentPrice),
          order.user.phoneNumber,
          transaction,
          order.id,
          order.details,
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return {
      result: 'ok',
    };
  }

  async changeOrderStatus(id: bigint, dto: ChangeOrderStatusDto) {
    const orderStatus = await this.orderStatusRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.orderStatusId }).build(),
    );
    if (!orderStatus) {
      throw new ForbiddenException(
        "you don't have permitted to operate this function",
      );
    }
    let order = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!order) {
      throw new NotFoundException('the order with this given id not founded!');
    }
    order.orderStatusId = dto.orderStatusId;
    order = await order.save();
    return {
      result: order,
    };
  }

  async changeShipmentWay(id: bigint, dto: ChangeShipmentWayDto) {
    const shipmentway = await this.orderShipmentWayRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.shipmentWayId }).build(),
    );
    if (!shipmentway) {
      throw new ForbiddenException(
        "you don't have permitted to operate this function",
      );
    }
    let order = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!order) {
      throw new NotFoundException('the order with this given id not founded!');
    }
    order.orderShipmentWayId = dto.shipmentWayId;
    order = await order.save();
    return {
      result: order,
    };
  }

  async editReceiptPost(id: bigint, dto: EditReceiptPostDto) {
    let order = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrder.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!order) {
      throw new NotFoundException('the order with this given id not founded!');
    }
    order.postReceipt = dto.receipt;
    order = await order.save();
    return {
      result: order,
    };
  }
}
