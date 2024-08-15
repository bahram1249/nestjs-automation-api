import { AutoMap } from 'automapper-classes';
import { IsOptional, MaxLength, MinLength } from 'class-validator';

export class CurrentPriceDto {
  @MinLength(3)
  @MaxLength(2048)
  @IsOptional()
  @AutoMap()
  currentPrice?: string;

  @MinLength(3)
  @MaxLength(2048)
  @IsOptional()
  @AutoMap()
  currentPriceJobStatus?: string;
}
