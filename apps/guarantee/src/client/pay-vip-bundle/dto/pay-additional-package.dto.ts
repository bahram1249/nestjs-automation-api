import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class PayVipBundleDto {
  @AutoMap()
  @IsNumber()
  vipBundleTypeId: number;

  @AutoMap()
  @IsNumber()
  paymentGatewayId: number;
}
