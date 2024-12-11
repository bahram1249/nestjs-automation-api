import { AutoMap } from 'automapper-classes';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CurrentPriceDto {
  @IsOptional()
  @IsNumber()
  @AutoMap()
  currentPrice?: number;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  goldStaticProfit?: number;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  goldProfit?: number;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  goldTax?: number;

  @IsBoolean()
  @IsOptional()
  @AutoMap()
  currentPriceJobStatus?: boolean;
}
