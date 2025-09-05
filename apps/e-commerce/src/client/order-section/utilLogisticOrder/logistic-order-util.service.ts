import { Injectable } from '@nestjs/common';
import { ECLogisticOrder, ECLogisticOrderGrouped } from '@rahino/localdatabase/models';

@Injectable()
export class LogisticOrderUtilService {
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

    const totalPrice = totalProductPrice - totalDiscountFee + totalShipmentPrice;

    order.set('totalProductPrice', totalProductPrice as any);
    order.set('totalDiscountFee', totalDiscountFee as any);
    order.set('totalShipmentPrice', totalShipmentPrice as any);
    order.set('totalPrice', totalPrice as any);

    return order;
  }
}
