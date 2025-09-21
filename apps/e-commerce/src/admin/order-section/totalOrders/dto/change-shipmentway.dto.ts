import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ChangeShipmentWayDto {
  @IsNumber()
  orderShipmentWayId: number;
}
