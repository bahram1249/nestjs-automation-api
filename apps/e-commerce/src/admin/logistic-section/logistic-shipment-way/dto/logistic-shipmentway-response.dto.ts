import { ApiProperty } from '@nestjs/swagger';

export class ProvinceResponseDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name: string;
}

export class OrderShipmentWayResponseDto {
  @ApiProperty({ example: 1, description: 'Order Shipment Way ID' })
  id: number;

  @ApiProperty({ example: 'Post', description: 'Shipment way name' })
  name: string;

  @ApiProperty({ example: false, description: 'Is periodic', required: false })
  isPeriodic?: boolean;
}

export class LogisticInfoResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic ID' })
  id: bigint;

  @ApiProperty({ example: 'Fast Delivery', description: 'Logistic title' })
  title: string;
}

export class LogisticShipmentWayResponseDto {
  @ApiProperty({ example: 1, description: 'Logistic Shipment Way ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Province ID', required: false })
  provinceId?: number;

  @ApiProperty({ example: 1, description: 'Logistic ID', required: false })
  logisticId?: bigint;

  @ApiProperty({ example: 1, description: 'Order Shipment Way ID' })
  orderShipmentWayId: number;

  @ApiProperty({
    description: 'Province',
    type: () => ProvinceResponseDto,
    required: false,
  })
  province?: ProvinceResponseDto;

  @ApiProperty({
    description: 'Order Shipment Way',
    type: () => OrderShipmentWayResponseDto,
    required: false,
  })
  orderShipmentWay?: OrderShipmentWayResponseDto;

  @ApiProperty({
    description: 'Logistic',
    type: () => LogisticInfoResponseDto,
    required: false,
  })
  logistic?: LogisticInfoResponseDto;
}
