import { User } from '@rahino/database';
import { PaymentTypeEnum } from '@rahino/ecommerce/shared/enum';
import { Transaction } from 'sequelize';

export class SingleVendorRequestPaymentDto {
  totalPrice: number;
  discountAmount: number;
  shipmentAmount: number;
  convertToRial: boolean;
  user: User;
  paymentType: PaymentTypeEnum;
  transaction?: Transaction;
  orderId?: bigint;
}
