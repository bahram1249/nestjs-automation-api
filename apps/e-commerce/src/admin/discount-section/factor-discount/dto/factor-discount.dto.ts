import { AutoMap } from 'automapper-classes';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class FactorDiscountDto {
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
  @IsOptional()
  priority?: number;

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
  @IsNumber()
  //@IsOptional()
  minPrice: bigint;

  @AutoMap()
  @IsNumber()
  //@IsOptional()
  maxPrice: bigint;
}
