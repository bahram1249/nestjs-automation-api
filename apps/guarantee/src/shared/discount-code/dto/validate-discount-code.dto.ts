import { AutoMap } from 'automapper-classes';
import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';

export class ValidateDiscountCodeDto {
  @AutoMap()
  @IsString()
  public discountCode: string;

  @AutoMap()
  @IsNumber()
  public vipBundleTypeId: bigint;
}
