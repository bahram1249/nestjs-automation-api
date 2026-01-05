import { AutoMap } from 'automapper-classes';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
} from 'class-validator';

export class DiscountCodePreviewResultDto {
  @AutoMap()
  @IsString()
  public discountCodeId: bigint;

  @AutoMap()
  @IsString()
  public discountCode: string;

  @AutoMap()
  @IsNumber()
  public originalPrice: number;

  @AutoMap()
  @IsNumber()
  public discountAmount: bigint;

  @AutoMap()
  @IsNumber()
  public finalPrice: number;

  @AutoMap()
  @IsNumber()
  public userPayAmount: number;

  @AutoMap()
  @IsBoolean()
  public canApply: boolean;

  @AutoMap()
  @IsOptional()
  @IsString()
  public error?: string;
}
