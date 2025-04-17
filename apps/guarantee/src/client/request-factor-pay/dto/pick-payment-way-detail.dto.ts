import { IsNumber } from 'class-validator';

export class PickPaymentWayDetailDto {
  @IsNumber()
  paymentGatewayId: number;
}
