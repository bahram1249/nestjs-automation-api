import { ApiProperty } from '@nestjs/swagger';
import { OrderStatusResponseDto } from './order-status-response.dto';
import { PaymentResponseDto } from './payment-response.dto';
import { UserResponseDto } from './user-response.dto';
import { AddressResponseDto } from './address-response.dto';
import { LogisticOrderGroupedResponseDto } from './logistic-order-grouped-response.dto';

export class LogisticOrderResponseDto {
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
    example: 5000,
    description: 'Real shipment price',
    required: false,
  })
  realShipmentPrice?: bigint;

  @ApiProperty({ example: 95000, description: 'Total price', required: false })
  totalPrice?: bigint;

  @ApiProperty({ example: 1, description: 'Order status ID' })
  orderStatusId: number;

  @ApiProperty({ example: 'session-id', description: 'Session ID' })
  sessionId: string;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({ example: 1, description: 'Address ID', required: false })
  addressId?: bigint;

  @ApiProperty({
    example: 'RECEIPT123',
    description: 'Post receipt',
    required: false,
  })
  postReceipt?: string;

  @ApiProperty({
    example: 'TRANS123',
    description: 'Transaction ID',
    required: false,
  })
  transactionId?: string;

  @ApiProperty({ example: 1, description: 'Payment ID', required: false })
  paymentId?: bigint;

  @ApiProperty({
    example: '1402-10-01',
    description: 'Gregorian at persian',
    required: false,
  })
  gregorianAtPersian?: string;

  @ApiProperty({
    example: 1000,
    description: 'Payment commission amount',
    required: false,
  })
  paymentCommissionAmount?: bigint;

  @ApiProperty({
    example: 'Note',
    description: 'Note description',
    required: false,
  })
  noteDescription?: string;

  @ApiProperty({
    type: () => OrderStatusResponseDto,
    description: 'Order status details',
    required: false,
  })
  orderStatus?: OrderStatusResponseDto;

  @ApiProperty({
    type: () => PaymentResponseDto,
    description: 'Payment details',
    required: false,
  })
  payment?: PaymentResponseDto;

  @ApiProperty({
    type: () => UserResponseDto,
    description: 'User details',
    required: false,
  })
  user?: UserResponseDto;

  @ApiProperty({
    type: () => AddressResponseDto,
    description: 'Address details',
    required: false,
  })
  address?: AddressResponseDto;

  @ApiProperty({
    type: () => [LogisticOrderGroupedResponseDto],
    description: 'Order groups',
    required: false,
  })
  groups?: LogisticOrderGroupedResponseDto[];
}
