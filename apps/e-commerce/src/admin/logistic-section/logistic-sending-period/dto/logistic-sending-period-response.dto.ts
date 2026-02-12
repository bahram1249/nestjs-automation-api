import { ApiProperty } from '@nestjs/swagger';

export class ShipmentWayResponseDto {
  @ApiProperty({ example: 1, description: 'Shipment Way ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Logistic ID', required: false })
  logisticId?: bigint;

  @ApiProperty({ example: 1, description: 'Order Shipment Way ID' })
  orderShipmentWayId: number;

  @ApiProperty({ example: 1, description: 'Province ID', required: false })
  provinceId?: number;
}

export class ScheduleSendingTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Schedule Sending Type ID' })
  id: number;

  @ApiProperty({ example: 'Weekly', description: 'Title' })
  title: string;

  @ApiProperty({ example: 'icon.png', description: 'Icon', required: false })
  icon?: string;
}

export class LogisticSendingPeriodResponseDto {
  @ApiProperty({ example: 1, description: 'Sending Period ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Logistic Shipment Way ID' })
  logisticShipmentWayId: bigint;

  @ApiProperty({ example: 1, description: 'Schedule Sending Type ID' })
  scheduleSendingTypeId: number;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Start Date',
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    example: '2024-12-31',
    description: 'End Date',
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    description: 'Shipment Way',
    type: () => ShipmentWayResponseDto,
    required: false,
  })
  shipmentWay?: ShipmentWayResponseDto;

  @ApiProperty({
    description: 'Schedule Sending Type',
    type: () => ScheduleSendingTypeResponseDto,
    required: false,
  })
  scheduleSendingType?: ScheduleSendingTypeResponseDto;
}

export class LogisticSendingPeriodDeleteResponseDto {
  @ApiProperty({ example: 1, description: 'Sending Period ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Logistic Shipment Way ID' })
  logisticShipmentWayId: bigint;

  @ApiProperty({ example: 1, description: 'Schedule Sending Type ID' })
  scheduleSendingTypeId: number;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Start Date',
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    example: '2024-12-31',
    description: 'End Date',
    required: false,
  })
  endDate?: Date;
}
