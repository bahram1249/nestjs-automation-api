import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PickShipmentWayDetailDto {
  @IsNumber()
  clientShipmentWayId: number;

  @IsNotEmpty()
  @IsString()
  clientShipmentWayTrackingCode: string;
}
