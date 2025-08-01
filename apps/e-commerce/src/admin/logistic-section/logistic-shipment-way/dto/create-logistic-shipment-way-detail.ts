import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { ShipmentWayDetailDto } from './shipment-way-detail.dto';

export class CreateLogisticShipmentWayDetailDto {
  @IsNumber()
  logisticId: bigint;

  @IsArray()
  @IsOptional()
  shipmentWayDetails?: ShipmentWayDetailDto[];
}
