import { User } from '@rahino/database';
import { ECOrderDetail } from '@rahino/localdatabase/models';
import { PaymentTypeEnum } from '@rahino/ecommerce/shared/enum';
import { Transaction } from 'sequelize';

export interface PayInterface {
  requestPayment(
    totalPrice: number,
    discountAmount: number,
    shipmentAmount: number,
    user: User,
    paymentType: PaymentTypeEnum,
    transaction?: Transaction,
    orderId?: bigint,
    orderDetails?: ECOrderDetail[],
  ): Promise<{ redirectUrl: string; paymentId: bigint }>;

  eligbleRequest(
    totalPrice: number,
    user?: User,
  ): Promise<{
    eligibleCheck: boolean;
    titleMessage?: string;
    description?: string;
  }>;

  eligbleToRevert(paymentId: bigint): Promise<boolean>;
}
