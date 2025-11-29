import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction, Op } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import {
  ECLogisticOrder,
  ECLogisticOrderGrouped,
} from '@rahino/localdatabase/models';
import { OrderStatusEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class LogisticOrderUtilService {
  constructor(
    @InjectModel(ECLogisticOrder)
    private readonly orderRepository: typeof ECLogisticOrder,
    @InjectModel(ECLogisticOrderGrouped)
    private readonly groupRepository: typeof ECLogisticOrderGrouped,
  ) {}
  async recalculateOrdersPrices(orders: ECLogisticOrder[]) {
    const promises = [] as Promise<ECLogisticOrder>[];
    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      promises.push(this.recalculateOrderPrices(order));
    }
    return await Promise.all(promises);
  }

  async recalculateOrderPrices(order: ECLogisticOrder) {
    // Sum across all groups/details like old util but adapted to logistic schema
    const groups = (order.groups || []) as ECLogisticOrderGrouped[];

    const totalProductPrice = groups
      .flatMap((g) => g.details || [])
      .map((d) => Number(d.productPrice || 0) * Number(d.qty || 0))
      .reduce((prev, curr) => prev + curr, 0);

    const totalDiscountFee = groups
      .flatMap((g) => g.details || [])
      .map((d) => Number(d.discountFeePerItem || 0) * Number(d.qty || 0))
      .reduce((prev, curr) => prev + curr, 0);

    const totalShipmentPrice = groups
      .map((g) => Number(g.shipmentPrice || 0))
      .reduce((p, c) => p + c, 0);

    const totalPrice =
      totalProductPrice - totalDiscountFee + totalShipmentPrice;

    order.set('totalProductPrice', totalProductPrice as any);
    order.set('totalDiscountFee', totalDiscountFee as any);
    order.set('totalShipmentPrice', totalShipmentPrice as any);
    order.set('totalPrice', totalPrice as any);

    return order;
  }

  /**
   * Roll-up parent order status based on all non-deleted groups.
   * Policy: parent reflects the least-advanced status among groups
   * (e.g., if any group is only Processed, parent stays Processed; only when
   * all groups are SendByCourier will parent advance to SendByCourier, etc.).
   * Deleted (canceled) groups are ignored in this roll-up.
   */
  async syncParentOrderStatus(
    logisticOrderId: bigint,
    transaction?: Transaction,
  ) {
    const groups = await this.groupRepository.findAll(
      new QueryOptionsBuilder()
        .attributes(['orderStatusId'])
        .filter({ logisticOrderId })
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
    if (!groups || groups.length === 0) return;

    // Determine roll-up status as min across groups
    const minStatusRaw = groups
      .map((g) => Number((g as any).orderStatusId ?? OrderStatusEnum.Paid))
      .reduce(
        (a, b) => (a < b ? a : b),
        OrderStatusEnum.DeliveredToTheCustomer,
      );

    // Never regress parent order to WaitingForPayment; clamp to at least Paid
    const minStatus = Math.max(minStatusRaw, OrderStatusEnum.Paid);

    await this.orderRepository.update(
      { orderStatusId: minStatus as any },
      { where: { id: logisticOrderId }, transaction },
    );
  }
}
