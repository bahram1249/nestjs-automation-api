import { AutoMap } from 'automapper-classes';
import { IsDateString, IsNumber, IsOptional, Min } from 'class-validator';

export class LogisticSendingPeriodDto {
  @AutoMap()
  @IsNumber()
  logisticShipmentWayId: number;

  @AutoMap()
  @IsNumber()
  @Min(1)
  scheduleSendingTypeId: number;

  @AutoMap()
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @AutoMap()
  @IsDateString()
  @IsOptional()
  endDate?: Date;
}
