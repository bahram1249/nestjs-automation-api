import { Injectable } from '@nestjs/common';
import { ECOrder } from '@rahino/localdatabase/models';

@Injectable()
export class OrderUtilService {
  async recalculateOrdersPrices(orders: ECOrder[]) {
    const promises = [];
    for (let index = 0; index < orders.length; index++) {
      const order = orders[index];
      promises.push(this.recalculateOrderPrices(order));
    }
    return await Promise.all(promises);
  }

  async recalculateOrderPrices(order: ECOrder) {
    const totalProductPrice = order.details
      .map((detail) => Number(detail.productPrice) * detail.qty)
      .reduce((prev, current) => prev + current, 0);

    const totalDiscountFee = order.details
      .map((detail) => Number(detail.discountFeePerItem) * detail.qty)
      .reduce((prev, current) => prev + current, 0);

    const totalPrice =
      totalProductPrice - totalDiscountFee + Number(order.totalShipmentPrice);

    // set all prices
    order.set('totalPrice', totalPrice);
    order.set('totalDiscountFee', totalDiscountFee);
    order.set('totalProductPrice', totalProductPrice);

    return order;
  }
}
