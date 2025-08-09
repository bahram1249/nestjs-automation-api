import { AutoMap } from 'automapper-classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class LogisticWeeklyPeriodTimeDto {
  @IsNumber()
  @IsOptional()
  @AutoMap()
  id?: number;

  @AutoMap()
  @IsString()
  startTime: string;

  @AutoMap()
  @IsString()
  endTime: string;

  @AutoMap()
  @IsNumber()
  capacity: number;
}
