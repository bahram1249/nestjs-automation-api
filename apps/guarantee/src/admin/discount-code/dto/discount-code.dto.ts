import { AutoMap } from 'automapper-classes';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DiscountCodeDto {
  @AutoMap()
  @IsString()
  public code: string;

  @AutoMap()
  @IsString()
  public title: string;

  @AutoMap()
  @IsNumber()
  public discountTypeId: number;

  @AutoMap()
  @IsNumber()
  public discountValue: number;

  @AutoMap()
  @IsNumber()
  public totalUsageLimit: number;

  @AutoMap()
  @IsNumber()
  public perUserUsageLimit: number;

  @AutoMap()
  @IsNumber()
  public maxDiscountAmount: bigint;

  @AutoMap()
  @IsDateString()
  public validFrom: Date;

  @AutoMap()
  @IsDateString()
  public validUntil: Date;

  @AutoMap()
  @IsBoolean()
  public isActive: boolean;

  @AutoMap()
  @IsOptional()
  @IsString()
  public description?: string;
}
