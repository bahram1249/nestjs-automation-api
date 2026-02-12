import { ApiProperty } from '@nestjs/swagger';
import {
  ReportCourierUserResponseDto,
  ReportOrderStatusResponseDto,
} from '../../../dto/report-shared-response.dto';

export class BasedCourierReportResponseDto {
  @ApiProperty({ example: 1, description: 'Order grouped ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Order status ID' })
  orderStatusId: number;

  @ApiProperty({ example: 1, description: 'Courier user ID' })
  courierUserId: bigint;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Delivery date',
    required: false,
  })
  deliveryDate?: Date;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Send to customer date',
    required: false,
  })
  sendToCustomerDate?: Date;

  @ApiProperty({
    example: 'RCPT-12345',
    description: 'Post receipt',
    required: false,
  })
  postReceipt?: string;

  @ApiProperty({
    example: 50000,
    description: 'Real shipment price',
    required: false,
  })
  realShipmentPrice?: number;

  @ApiProperty({
    example: 60000,
    description: 'Total shipment price',
    required: false,
  })
  totalShipmentPrice?: number;

  @ApiProperty({
    example: 10000,
    description: 'Profit amount',
    required: false,
  })
  profitAmount?: number;

  @ApiProperty({
    description: 'Courier user details',
    type: () => ReportCourierUserResponseDto,
    required: false,
  })
  courierUser?: ReportCourierUserResponseDto;

  @ApiProperty({
    description: 'Order status details',
    type: () => ReportOrderStatusResponseDto,
    required: false,
  })
  orderStatus?: ReportOrderStatusResponseDto;
}

export class BasedCourierReportTotalResponseDto {
  @ApiProperty({ example: 50, description: 'Count of orders' })
  cntOrder: number;

  @ApiProperty({ example: 2500000, description: 'Total real shipment price' })
  realShipmentPrice: number;

  @ApiProperty({ example: 3000000, description: 'Total shipment price' })
  totalShipmentPrice: number;

  @ApiProperty({ example: 500000, description: 'Total profit amount' })
  profitAmount: number;
}
