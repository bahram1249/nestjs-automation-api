import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusResponseDto } from './order-status-response.dto';
import { OrderShipmentWayResponseDto } from './order-shipment-way-response.dto';
import { OrderDetailResponseDto } from './order-detail-response.dto';
import { OrderAddressResponseDto } from './order-address-response.dto';
import { OrderPaymentResponseDto } from './order-payment-response.dto';

export class OrderResponseDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  id: bigint;

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
    description: 'Total shipment price',
    required: false,
  })
  totalShipmentPrice?: bigint;

  @ApiProperty({
    example: 1,
    description: 'Order Shipment Way ID',
    required: false,
  })
  orderShipmentWayId?: number;

  @ApiProperty({ example: 115000, description: 'Total price', required: false })
  totalPrice?: bigint;

  @ApiProperty({ example: 1, description: 'Order Status ID' })
  orderStatusId: number;

  @ApiProperty({ example: 'session-123', description: 'Session ID' })
  sessionId: string;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Address ID', required: false })
  addressId?: bigint;

  @ApiProperty({
    example: false,
    description: 'Is deleted flag',
    required: false,
  })
  isDeleted?: boolean;

  @ApiProperty({
    example: 'TXN-123456',
    description: 'Transaction ID',
    required: false,
  })
  transactionId?: string;

  @ApiProperty({ example: 1, description: 'Payment ID', required: false })
  paymentId?: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Delivery date',
    required: false,
  })
  deliveryDate?: Date;

  @ApiProperty({
    example: '1402-10-01',
    description: 'Gregorian date at Persian format',
    required: false,
  })
  gregorianAtPersian?: string;

  @ApiProperty({
    type: () => OrderStatusResponseDto,
    description: 'Order status details',
    required: false,
  })
  orderStatus?: OrderStatusResponseDto;

  @ApiProperty({
    type: () => OrderShipmentWayResponseDto,
    description: 'Order shipment way details',
    required: false,
  })
  orderShipmentWay?: OrderShipmentWayResponseDto;

  @ApiProperty({
    type: () => [OrderDetailResponseDto],
    description: 'Order details',
    required: false,
  })
  details?: OrderDetailResponseDto[];

  @ApiProperty({
    type: () => OrderAddressResponseDto,
    description: 'Address details',
    required: false,
  })
  address?: OrderAddressResponseDto;

  @ApiProperty({
    type: () => OrderPaymentResponseDto,
    description: 'Payment details',
    required: false,
  })
  payment?: OrderPaymentResponseDto;
}
