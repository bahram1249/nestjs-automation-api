import { AutoMap } from 'automapper-classes';
import { IsArray, IsNumber } from 'class-validator';

export class PayAdditionalPackageDto {
  @AutoMap()
  @IsNumber()
  guaranteeId: bigint;

  @AutoMap()
  @IsArray()
  additionalPackages: number[];

  @AutoMap()
  @IsNumber()
  paymentGatewayId: number;
}
