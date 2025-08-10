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
import { LogisticWeeklyPeriodDetailDto } from './logistic-weekly-period-detail.dto';

export class LogisticWeeklyPeriodDto {
  @AutoMap()
  @IsNumber()
  logisticSendingPeriodId: number;

  @AutoMap()
  @IsArray()
  @IsOptional()
  logisticWeeklyPeriods?: LogisticWeeklyPeriodDetailDto[];
}
