import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';
import { VipBundleDto } from './vip-bundle.dto';

export class PayVipBundleDto extends VipBundleDto {
  @AutoMap()
  @IsNumber()
  paymentGatewayId: number;
}
