import { ApiProperty } from '@nestjs/swagger';
import { OrderShipmentWayResponseDto } from './order-shipment-way-response.dto';
import { ProvinceResponseDto } from './province-response.dto';

export class LogisticShipmentWayResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic shipment way ID' })
  id: number;

  @ApiProperty({ example: 1, description: 'Logistic ID' })
  logisticId: number;

  @ApiProperty({ example: 1, description: 'Order shipment way ID' })
  orderShipmentWayId: number;

  @ApiProperty({ example: 1, description: 'Province ID', required: false })
  provinceId?: number;

  @ApiProperty({
    type: () => OrderShipmentWayResponseDto,
    description: 'Order shipment way details',
    required: false,
  })
  orderShipmentWay?: OrderShipmentWayResponseDto;

  @ApiProperty({
    type: () => ProvinceResponseDto,
    description: 'Province details',
    required: false,
  })
  province?: ProvinceResponseDto;
}
