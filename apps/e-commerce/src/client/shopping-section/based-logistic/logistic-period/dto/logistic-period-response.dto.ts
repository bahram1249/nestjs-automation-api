import { ApiProperty } from '@nestjs/swagger';
import { OrderShipmentwayEnum } from '@rahino/ecommerce/shared/enum';

export class LogisticPeriodTimeDto {
  @ApiProperty({ example: 1, description: 'Weekly period time ID' })
  weeklyPeriodTimeId: number;

  @ApiProperty({ example: '09:00:00', description: 'Start time' })
  startTime: string;

  @ApiProperty({ example: '12:00:00', description: 'End time' })
  endTime: string;

  @ApiProperty({ example: 1, description: 'Sending period ID' })
  sendingPeriodId: number;

  @ApiProperty({ example: 1, description: 'Weekly period ID' })
  weeklyPeriodId: number;

  @ApiProperty({ example: 10, description: 'Capacity' })
  capacity: number;
}

export class LogisticPeriodPossibleDateDto {
  @ApiProperty({
    example: '2024-01-15T00:00:00.000Z',
    description: 'Gregorian date',
  })
  gregorianDate: string;

  @ApiProperty({ example: '1402/10/25', description: 'Persian date' })
  persianDate: string;

  @ApiProperty({ example: 'یکشنبه', description: 'Week day name' })
  weekDayName: string;

  @ApiProperty({
    type: () => [LogisticPeriodTimeDto],
    description: 'Available times',
  })
  times: LogisticPeriodTimeDto[];
}

export class LogisticPeriodShipmentWayDto {
  @ApiProperty({ example: 1, description: 'Shipment way ID' })
  shipmentWayId: number;

  @ApiProperty({ example: 1, description: 'Order shipment way ID' })
  orderShipmentwayId: number;

  @ApiProperty({ example: 'پیک', description: 'Shipment way name' })
  shipmentWayName: string;

  @ApiProperty({ example: 'delivery.png', description: 'Shipment way icon' })
  shipmentWayIcon: string;

  @ApiProperty({
    type: () => [LogisticPeriodPossibleDateDto],
    description: 'Possible dates',
  })
  possibleDates: LogisticPeriodPossibleDateDto[];

  @ApiProperty({ example: 15000, description: 'Price' })
  price: number;

  @ApiProperty({ example: 20000, description: 'Real shipment price' })
  realShipmentPrice: number;
}

export class LogisticPeriodSendingOptionDto {
  @ApiProperty({ example: 1, description: 'Type ID' })
  typeId: number;

  @ApiProperty({ example: 'Normal', description: 'Type name' })
  typeName: string;

  @ApiProperty({
    example: 'normal.png',
    description: 'Type icon',
    required: false,
  })
  typeIcon?: string;

  @ApiProperty({
    type: () => [LogisticPeriodShipmentWayDto],
    description: 'Shipment ways',
  })
  shipmentWays: LogisticPeriodShipmentWayDto[];

  @ApiProperty({ type: Object, description: 'Best selection', required: false })
  bestSelection?: {
    shipmentWayId: number;
    gregorianDate: Date;
    weeklyPeriodTimeId: number;
  };

  @ApiProperty({ type: () => [Number], description: 'Supported stock IDs' })
  supportedStockIds: number[];
}

export class LogisticPeriodGroupDto {
  @ApiProperty({ example: 1, description: 'Logistic ID' })
  logisticId: number;

  @ApiProperty({ example: 'Logistic Name', description: 'Logistic name' })
  logisticName: string;

  @ApiProperty({ type: () => [Number], description: 'Vendor IDs' })
  vendorIds: number[];

  @ApiProperty({ type: () => [String], description: 'Vendor names' })
  vendorNames: string[];

  @ApiProperty({
    type: () => [LogisticPeriodSendingOptionDto],
    description: 'Sending options',
  })
  sendingOptions: LogisticPeriodSendingOptionDto[];
}

export class LogisticPeriodResponseDto {
  @ApiProperty({
    type: () => [LogisticPeriodGroupDto],
    description: 'Result groups',
  })
  result: LogisticPeriodGroupDto[];
}
