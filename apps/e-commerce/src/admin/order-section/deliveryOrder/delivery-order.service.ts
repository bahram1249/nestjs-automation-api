import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECOrder } from '@rahino/localdatabase/models';
import {
  OrderShipmentwayEnum,
  OrderStatusEnum,
} from '@rahino/ecommerce/shared/enum';
import { OrderQueryBuilder } from '../utilOrder/service/order-query-builder.service';
import { ListFilter } from '@rahino/query-filter';
import { OrderUtilService } from '../utilOrder/service/order-util.service';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { RoleUtilService } from '@rahino/core/user/role-util/role-util.service';

@Injectable()
export class DeliveryOrderService {
  constructor(
    @InjectModel(ECOrder)
    private readonly repository: typeof ECOrder,
    private readonly orderQueryBuilder: OrderQueryBuilder,
    private readonly orderUtilService: OrderUtilService,
    private readonly roleUtilService: RoleUtilService,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);
    let builder = this.orderQueryBuilder;
    builder = builder
      .nonDeletedOrder()
      .orderShipmentWay(OrderShipmentwayEnum.delivery)
      .addOrderStatus(OrderStatusEnum.SendByCourier)
      .search(filter.search);

    if (!isSuperAdmin) {
      builder = builder.addOnlyCourier(user.id);
    }

    const count = await this.repository.count(builder.build());

    builder = builder
      .subQuery(true)
      .includeOrderShipmentWay()
      .includeAdminOrderDetails()
      .includeAddress()
      .includeUser()
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
    let builder = this.orderQueryBuilder;

    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);

    builder = builder
      .nonDeletedOrder()
      .includeOrderShipmentWay()
      .orderShipmentWay(OrderShipmentwayEnum.delivery)
      .addOrderId(id)
      .addOrderStatus(OrderStatusEnum.SendByCourier)
      .includeAdminOrderDetails()
      .includeAddress()
      .includeUser();

    if (!isSuperAdmin) {
      builder = builder.addOnlyCourier(user.id);
    }

    let result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    result = await this.orderUtilService.recalculateOrderPrices(result);

    return {
      result: result,
    };
  }

  async processDelivery(orderId: bigint, user: User) {
    const isSuperAdmin = await this.roleUtilService.isSuperAdmin(user);

    let builder = this.orderQueryBuilder;
    builder = builder
      .nonDeletedOrder()
      .includeOrderShipmentWay()
      .orderShipmentWay(OrderShipmentwayEnum.delivery)
      .addOrderId(orderId)
      .addOrderStatus(OrderStatusEnum.SendByCourier)
      .includeAdminOrderDetails()
      .includeAddress()
      .includeUser();

    if (!isSuperAdmin) {
      builder = builder.addOnlyCourier(user.id);
    }

    let result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    result.orderStatusId = OrderStatusEnum.DeliveredToTheCustomer;
    result.sendToCustomerDate = new Date();
    result.sendToCustomerBy = user.id;
    // item.deliveryDate = new Date();
    result = await result.save();

    return {
      result: result,
    };
  }
}
