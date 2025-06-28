import { User } from '@rahino/database';
import { SingleVendorRequestPaymentDto } from '../dto';

export interface SingleVendorPayInterface {
  requestPayment(
    dto: SingleVendorRequestPaymentDto,
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
