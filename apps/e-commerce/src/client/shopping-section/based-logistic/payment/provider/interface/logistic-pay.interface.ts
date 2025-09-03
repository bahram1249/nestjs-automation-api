import { User } from '@rahino/database';
import { PaymentTypeEnum } from '@rahino/ecommerce/shared/enum';
import { Transaction } from 'sequelize';
import { ECLogisticOrderGroupedDetail } from '@rahino/localdatabase/models';

export interface LogisticPayInterface {
  requestPayment(
    totalPrice: number,
    discountAmount: number,
    shipmentAmount: number,
    user: User,
    paymentType: PaymentTypeEnum,
    transaction?: Transaction,
    logisticOrderId?: bigint,
    groupedDetails?: ECLogisticOrderGroupedDetail[],
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
