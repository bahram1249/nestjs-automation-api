import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PickShipmentWayDetailDto {
  @IsNumber()
  cartableShipmentWayId: number;

  @IsNotEmpty()
  @IsString()
  cartableShipmentWayTrackingCode: string;
}
