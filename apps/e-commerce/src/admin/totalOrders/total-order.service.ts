import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { OrderStatusEnum } from '@rahino/ecommerce/util/enum';
import { OrderQueryBuilder } from '../utilOrder/service/order-query-builder.service';
import { ListFilter } from '@rahino/query-filter';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { Sequelize, Transaction } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { ECPayment } from '@rahino/database/models/ecommerce-eav/ec-payment-entity';
import { ECPaymentGateway } from '@rahino/database/models/ecommerce-eav/ec-payment-gateway.entity';
import { SnapPayService } from '@rahino/ecommerce/user/payment/provider/services';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { RoleUtilService } from '@rahino/core/user/role-util/role-util.service';
import { UserVendorService } from '@rahino/ecommerce/user/vendor/user-vendor.service';
import { OrderUtilService } from '../utilOrder/service/order-util.service';

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
    private orderQueryBuilder: OrderQueryBuilder,
    private snapPayService: SnapPayService,
    private roleUtilService: RoleUtilService,
    private userVendorService: UserVendorService,
    private orderUtilService: OrderUtilService,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);
    const vendorIds = await this.userVendorService.findVendorIds(user);

    let builder = this.orderQueryBuilder
      .nonDeletedOrder()
      .search(filter.search)
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment);

    if (!isSuperAdmin) {
      builder = builder.addOnlyVendor(vendorIds);
    }

    const count = await this.repository.count(builder.build());

    if (isSuperAdmin) {
      builder = builder.addAdminOrderDetails();
    } else {
      builder = builder.addAdminOrderDetails(vendorIds);
    }

    builder = builder
      .subQuery(true)
      .addOrderShipmentWay()
      .addAddress()
      .addUser()
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
        .addAdminOrderDetails(vendorIds);
    } else {
      builder = builder.addAdminOrderDetails();
    }

    builder = builder
      .nonDeletedOrder()
      .addOrderShipmentWay()
      .addOrderId(id)
      .addNegativeOrderStatus(OrderStatusEnum.WaitingForPayment)
      .addAddress()
      .addUser();

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
      let item = await this.repository.findOne(
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
      let detail = await this.orderDetailRepository.findOne(
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
      let queryBulder = new QueryOptionsBuilder()
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
      let resultQuery = queryBulder.build();
      resultQuery.limit = null;
      resultQuery.offset = null;
      resultQuery.order = null;
      resultQuery.subQuery = false;
      const totalPrice = await this.orderDetailRepository.findOne(resultQuery);
      let order = await this.repository.findOne(
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
      let detail = await this.orderDetailRepository.findOne(
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
      let queryBulder = new QueryOptionsBuilder()
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
      let resultQuery = queryBulder.build();
      resultQuery.limit = null;
      resultQuery.offset = null;
      resultQuery.order = null;
      resultQuery.subQuery = false;
      const totalPrice = await this.orderDetailRepository.findOne(resultQuery);
      let order = await this.repository.findOne(
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
}
