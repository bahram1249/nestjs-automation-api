import { IsNumber } from 'class-validator';

export class LogisticShipmentWayDto {
  @IsNumber()
  logisticShipmentWayId: number;
}
