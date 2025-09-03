import { OrderShipmentwayEnum, PaymentTypeEnum } from '@rahino/ecommerce/shared/enum';

export class LogisticStockPaymentDto {
  // Selected variation price context and payment gateway
  variationPriceId!: bigint;
  paymentId!: bigint;

  // Address and optional note
  addressId!: bigint;
  noteDescription?: string;

  // Optional coupon
  couponCode?: string;

  // Groups selected by FE (must cover all session stocks)
  groups!: LogisticShipmentSelectionGroupInput[];
}

export interface LogisticPaymentRequestResult {
  redirectUrl: string;
}

// Minimal group payload expected from client for logistics payment
export interface LogisticShipmentSelectionGroupInput {
  logisticId: number;
  shipmentWayId: number;
  shipmentWayType: OrderShipmentwayEnum;
  // optional schedule/weekly periods
  sendingPeriodId?: number | null;
  weeklyPeriodId?: number | null;
  weeklyPeriodTimeId?: number | null;
  // minimal stock identifiers only
  stockIds: Array<string | number | bigint>;
}
