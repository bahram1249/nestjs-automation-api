import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECOrder } from '@rahino/database/models/ecommerce-eav/ec-order.entity';
import { GetOrderDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import {
  OrderDetailStatusEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/util/enum';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { UserVendorService } from '@rahino/ecommerce/user/vendor/user-vendor.service';
import { OrderQueryBuilder } from '../utilOrder/service/order-query-builder.service';
import { OrderUtilService } from '../utilOrder/service/order-util.service';
import { SmsService } from '@rahino/sms/sms.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PendingOrderService {
  constructor(
    @InjectModel(ECOrder)
    private readonly repository: typeof ECOrder,
    @InjectModel(ECOrderDetail)
    private readonly orderDetailRepository: typeof ECOrderDetail,
    private readonly userVendorService: UserVendorService,
    private orderQueryBuilder: OrderQueryBuilder,
    private orderUtilService: OrderUtilService,
    @Inject('sms')
    private readonly smsService: SmsService,
    private readonly config: ConfigService,
  ) {}

  async findAll(user: User, filter: GetOrderDto) {
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      filter.vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException('cannot find access to this vendor');
    }
    let builder = this.orderQueryBuilder;

    builder = builder
      .nonDeletedOrder()
      .addOrderStatus(OrderStatusEnum.Paid)
      .addOnlyVendor([filter.vendorId])
      .search(filter.search);

    const count = await this.repository.count(builder.build());

    builder = builder
      .subQuery(true)
      .includeAdminOrderDetails([filter.vendorId])
      .includeOrderShipmentWay()
      .includeAddress()
      .includeUser()
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    let result = await this.repository.findAll(builder.build());
    result = await this.orderUtilService.recalculateOrdersPrices(result);

    return {
      result: result,
      total: count,
    };
  }

  async findById(id: bigint, user: User, filter: GetOrderDto) {
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      filter.vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException('cannot find access to this vendor');
    }

    let builder = this.orderQueryBuilder;

    builder = builder
      .nonDeletedOrder()
      .addOrderId(id)
      .includeOrderShipmentWay()
      .addOrderStatus(OrderStatusEnum.Paid)
      .addOnlyVendor([filter.vendorId])
      .includeAdminOrderDetails([filter.vendorId])
      .includeAddress()
      .includeUser();

    let result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException('the item with this given id not found!');
    }
    result = await this.orderUtilService.recalculateOrderPrices(result);

    return {
      result: result,
    };
  }

  async processDetail(detailId: bigint, user: User) {
    let detailOrder = await this.orderDetailRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: detailId })
        .filter({
          orderDetailStatusId: OrderDetailStatusEnum.WaitingForProcess,
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrderDetail.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!detailOrder) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    const vendorId = detailOrder.vendorId;
    const isAccess = await this.userVendorService.isAccessToVendor(
      user,
      vendorId,
    );
    if (!isAccess) {
      throw new ForbiddenException('the item with this given id not founded!');
    }
    detailOrder.orderDetailStatusId = OrderDetailStatusEnum.Processed;
    await detailOrder.save();

    const findAny = await this.orderDetailRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ orderId: detailOrder.orderId })
        .filter({
          orderDetailStatusId: {
            [Op.ne]: OrderDetailStatusEnum.Processed,
          },
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECOrderDetail.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!findAny) {
      let order = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({
            id: detailOrder.orderId,
          })
          .build(),
      );
      order.orderStatusId = OrderStatusEnum.OrderHasBeenProcessed;
      order = await order.save();

      // sms here

      await this.smsService.sendMessage({
        text: `${order.id}`,
        to: user.phoneNumber,
        bodyId: this.config.get('ECOMMERCE_PROCESSED_SMS_CODE'),
      });
    }

    return {
      result: detailOrder,
    };
  }
}
