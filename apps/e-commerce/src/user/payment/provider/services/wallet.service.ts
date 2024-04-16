import { NotImplementedException } from '@nestjs/common';
import { PayInterface } from '../interface';
import { User } from '@rahino/database/models/core/user.entity';
import { PaymentTypeEnum } from '@rahino/ecommerce/util/enum';
import { Transaction } from 'sequelize';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';

export class WalletService implements PayInterface {
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
