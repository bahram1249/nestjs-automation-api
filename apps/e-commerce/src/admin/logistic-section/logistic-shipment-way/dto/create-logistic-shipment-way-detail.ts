import { IsArray, IsNumber, IsObject, IsOptional } from 'class-validator';
import { ShipmentWayDetailDto } from './shipment-way-detail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLogisticShipmentWayDetailDto {
  @ApiProperty()
  @IsNumber()
  logisticId: bigint;

  @ApiProperty()
  @IsArray()
  @IsOptional()
  shipmentWayDetails?: ShipmentWayDetailDto[];
}
