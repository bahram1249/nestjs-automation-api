import { User } from '@rahino/database/models/core/user.entity';
import { ECOrderDetail } from '@rahino/database/models/ecommerce-eav/ec-order-detail.entity';
import { PaymentTypeEnum } from '@rahino/ecommerce/util/enum';
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

  eligbleRequest(totalPrice: number): Promise<{
    eligibleCheck: boolean;
    titleMessage?: string;
    description?: string;
  }>;

  eligbleToRevert(paymentId: bigint): Promise<boolean>;
}
