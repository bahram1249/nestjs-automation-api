import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChangeShipmentWayDto {
  @IsNumber()
  shipmentWayId: number;
}
