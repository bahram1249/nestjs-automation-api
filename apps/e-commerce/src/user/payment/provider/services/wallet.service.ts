import { NotImplementedException } from '@nestjs/common';
import { PayInterface } from '../interface';
import { User } from '@rahino/database/models/core/user.entity';
import { PaymentTypeEnum } from '@rahino/ecommerce/util/enum';
import { Transaction } from 'sequelize';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';

export class WalletService implements PayInterface {
  constructor() {}
  async eligbleToRevert(paymentId: bigint): Promise<boolean> {
    return true;
  }
  async requestPayment(
    totalPrice: number,
    discountAmount: number,
    shipmentAmount: number,
    user: User,
    paymentType: PaymentTypeEnum,
    transaction?: Transaction,
    orderId?: bigint,
    orderDetails?: ECOrderDetail[],
  ): Promise<{ redirectUrl: string; paymentId: bigint }> {
    throw new NotImplementedException();
    return null;
  }

  async eligbleRequest(totalPrice: number): Promise<{
    eligibleCheck: boolean;
    titleMessage?: string;
    description?: string;
  }> {
    return {
      eligibleCheck: true,
      titleMessage: null,
      description: null,
    };
  }
}
