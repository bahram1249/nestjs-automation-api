import { User } from '@rahino/database/models/core/user.entity';
import { PayInterface } from '../interface';
import { PaymentTypeEnum } from '@rahino/ecommerce/util/enum';
import { Transaction } from 'sequelize';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { NotImplementedException } from '@nestjs/common';

export class ZarinPalService implements PayInterface {
  constructor() {}
  async requestPayment(
    totalPrice: number,
    user: User,
    paymentType: PaymentTypeEnum,
    transaction?: Transaction,
    orderId?: bigint,
    orderDetails?: ECOrderDetail[],
  ) {
    throw new NotImplementedException();
    return '';
  }
}
