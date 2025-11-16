import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PickShipmentWayDetailDto {
  @IsNumber()
  clientShipmentWayId: number;

  @IsOptional()
  @IsString()
  clientShipmentWayTrackingCode?: string;
}
