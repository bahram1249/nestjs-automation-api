import { AutoMap } from 'automapper-classes';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class DiscountDto {
  @AutoMap()
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  name: string;

  @AutoMap()
  @IsString()
  @IsOptional()
  description?: string;

  @AutoMap()
  @IsNumber()
  discountTypeId: number;

  @AutoMap()
  @IsNumber()
  discountActionTypeId: number;

  @AutoMap()
  @IsNumber()
  discountActionRuleId: number;

  @AutoMap()
  @IsNumber()
  discountValue: number;

  @AutoMap()
  @IsNumber()
  @Min(1)
  @IsOptional()
  maxValue?: number;

  @AutoMap()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  couponCode?: string;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  priority?: number;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  limit?: number;

  @AutoMap()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @AutoMap()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @AutoMap()
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @AutoMap()
  @IsBoolean()
  @IsOptional()
  freeShipment?: boolean;
}
