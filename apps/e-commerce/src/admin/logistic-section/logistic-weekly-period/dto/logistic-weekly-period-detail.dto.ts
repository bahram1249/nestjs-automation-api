import { AutoMap } from 'automapper-classes';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { LogisticWeeklyPeriodTimeDto } from './logistic-weekly-period-time.dto';

export class LogisticWeeklyPeriodDetailDto {
  @AutoMap()
  @IsNumber()
  @IsOptional()
  id?: number;

  @AutoMap()
  @IsNumber()
  @Min(1)
  @Max(7)
  weekNumber: number;

  @AutoMap()
  @IsOptional()
  @IsArray()
  logisticWeeklyPeriodTimes?: LogisticWeeklyPeriodTimeDto[];
}
