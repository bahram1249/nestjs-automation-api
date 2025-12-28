import { AutoMap } from 'automapper-classes';
import {
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ValidateDiscountCodeDto {
  @AutoMap()
  @IsString()
  public vipBundleTypeId: bigint;

  @AutoMap()
  @IsString()
  public discountCode?: string;
}

export class DiscountCodePreviewDto {
  @AutoMap()
  @IsNumber()
  public originalPrice: bigint;

  @AutoMap()
  @IsNumber()
  public discountAmount?: bigint;

  @AutoMap()
  @IsNumber()
  public finalPrice: bigint;

  @AutoMap()
  @IsOptional()
  @IsString()
  public discountCodeTitle?: string;
}
