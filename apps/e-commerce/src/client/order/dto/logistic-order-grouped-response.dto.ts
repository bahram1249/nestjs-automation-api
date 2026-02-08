import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusResponseDto } from './order-status-response.dto';
import { LogisticResponseDto } from './logistic-response.dto';
import { LogisticShipmentWayResponseDto } from './logistic-shipment-way-response.dto';
import { LogisticSendingPeriodResponseDto } from './logistic-sending-period-response.dto';
import { LogisticWeeklyPeriodResponseDto } from './logistic-weekly-period-response.dto';
import { LogisticWeeklyPeriodTimeResponseDto } from './logistic-weekly-period-time-response.dto';
import { LogisticOrderGroupedDetailResponseDto } from './logistic-order-grouped-detail-response.dto';

export class LogisticOrderGroupedResponseDto {
  @ApiProperty({ example: 1, description: 'Grouped ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Logistic ID', required: false })
  logisticId?: number;

  @ApiProperty({
    example: 1,
    description: 'Logistic shipment way ID',
    required: false,
  })
  logisticShipmentWayId?: number;

  @ApiProperty({
    example: 1,
    description: 'Order shipment way ID',
    required: false,
  })
  orderShipmentWayId?: number;

  @ApiProperty({
    example: 1,
    description: 'Logistic sending period ID',
    required: false,
  })
  logisticSendingPeriodId?: number;

  @ApiProperty({
    example: 1,
    description: 'Logistic weekly period ID',
    required: false,
  })
  logisticWeeklyPeriodId?: number;

  @ApiProperty({
    example: 1,
    description: 'Logistic weekly period time ID',
    required: false,
  })
  logisticWeeklyPeriodTimeId?: number;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Sending gregorian date',
    required: false,
  })
  sendingGregorianDate?: Date;

  @ApiProperty({ example: 1, description: 'Order status ID' })
  orderStatusId: number;

  @ApiProperty({
    example: 100000,
    description: 'Total product price',
    required: false,
  })
  totalProductPrice?: bigint;

  @ApiProperty({
    example: 10000,
    description: 'Total discount fee',
    required: false,
  })
  totalDiscountFee?: bigint;

  @ApiProperty({
    example: 5000,
    description: 'Shipment price',
    required: false,
  })
  shipmentPrice?: bigint;

  @ApiProperty({
    example: 5000,
    description: 'Real shipment price',
    required: false,
  })
  realShipmentPrice?: bigint;

  @ApiProperty({ example: 95000, description: 'Total price', required: false })
  totalPrice?: bigint;

  @ApiProperty({ example: 1, description: 'Courier user ID', required: false })
  courierUserId?: bigint;

  @ApiProperty({
    example: 'RECEIPT123',
    description: 'Post receipt',
    required: false,
  })
  postReceipt?: string;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Delivery date',
    required: false,
  })
  deliveryDate?: Date;

  @ApiProperty({
    example: '2024-01-01',
    description: 'Send to customer date',
    required: false,
  })
  sendToCustomerDate?: Date;

  @ApiProperty({
    example: 1,
    description: 'Send to customer by',
    required: false,
  })
  sendToCustomerBy?: bigint;

  @ApiProperty({
    type: () => OrderStatusResponseDto,
    description: 'Order status details',
    required: false,
  })
  orderStatus?: OrderStatusResponseDto;

  @ApiProperty({
    type: () => LogisticResponseDto,
    description: 'Logistic details',
    required: false,
  })
  logistic?: LogisticResponseDto;

  @ApiProperty({
    type: () => LogisticShipmentWayResponseDto,
    description: 'Logistic shipment way details',
    required: false,
  })
  logisticShipmentWay?: LogisticShipmentWayResponseDto;

  @ApiProperty({
    type: () => LogisticSendingPeriodResponseDto,
    description: 'Logistic sending period details',
    required: false,
  })
  logisticSendingPeriod?: LogisticSendingPeriodResponseDto;

  @ApiProperty({
    type: () => LogisticWeeklyPeriodResponseDto,
    description: 'Logistic weekly period details',
    required: false,
  })
  logisticWeeklyPeriod?: LogisticWeeklyPeriodResponseDto;

  @ApiProperty({
    type: () => LogisticWeeklyPeriodTimeResponseDto,
    description: 'Logistic weekly period time details',
    required: false,
  })
  logisticWeeklyPeriodTime?: LogisticWeeklyPeriodTimeResponseDto;

  @ApiProperty({
    type: () => [LogisticOrderGroupedDetailResponseDto],
    description: 'Grouped details',
    required: false,
  })
  details?: LogisticOrderGroupedDetailResponseDto[];
}
