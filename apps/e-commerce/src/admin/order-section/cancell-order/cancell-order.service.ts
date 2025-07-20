import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';
import { OrderQueryBuilder } from '../utilOrder/service/order-query-builder.service';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { Sequelize } from 'sequelize';
import { ECPayment } from '@rahino/localdatabase/models';
import { ECPaymentGateway } from '@rahino/localdatabase/models';
import { SnapPayService } from '@rahino/ecommerce/user/shopping/payment/provider/services';
import { RoleUtilService } from '@rahino/core/user/role-util/role-util.service';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { OrderUtilService } from '../utilOrder/service/order-util.service';
import { FinalizedPaymentService } from '@rahino/ecommerce/user/shopping/payment/util/finalized-payment/finalized-payment.service';
import { ECOrderStatus } from '@rahino/localdatabase/models';
import { ECOrderShipmentWay } from '@rahino/localdatabase/models';
import { GetTotalOrderFilterDto } from './dto/get-total-order.dto';

@Injectable()
export class CancellOrderService {
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
      .deletedOrder()
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
      .deletedOrder()
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
}
