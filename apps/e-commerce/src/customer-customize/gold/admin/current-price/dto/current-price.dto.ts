import { AutoMap } from 'automapper-classes';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class CurrentPriceDto {
  @IsOptional()
  @IsNumber()
  @AutoMap()
  currentPrice?: number;

  @IsBoolean()
  @IsOptional()
  @AutoMap()
  currentPriceJobStatus?: boolean;
}
