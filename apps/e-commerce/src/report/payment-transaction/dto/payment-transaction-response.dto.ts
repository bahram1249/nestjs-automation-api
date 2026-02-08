import { ApiProperty } from '@nestjs/swagger';

export class PaymentTransactionResponseDto {
  @ApiProperty({ example: 1, description: 'Order ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Order status ID' })
  orderStatusId: number;

  @ApiProperty({ example: 1, description: 'Order shipment way ID' })
  orderShipmentwayId: number;

  @ApiProperty({
    example: 'txn-12345',
    description: 'Transaction ID',
    required: false,
  })
  transactionId?: string;

  @ApiProperty({
    example: 50000,
    description: 'Real shipment price',
    required: false,
  })
  realShipmentPrice?: number;

  @ApiProperty({
    example: 10000,
    description: 'Total discount fee',
    required: false,
  })
  totalDiscountFee?: number;

  @ApiProperty({ example: 500000, description: 'Total price', required: false })
  totalPrice?: number;

  @ApiProperty({
    example: 25000,
    description: 'Payment commission amount',
    required: false,
  })
  paymentCommissionAmount?: number;

  @ApiProperty({
    example: 475000,
    description: 'Received amount',
    required: false,
  })
  receivedAmount?: number;

  @ApiProperty({
    example: '2026-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Order status details',
    type: 'object',
    required: false,
  })
  orderStatus?: any;
}

export class PaymentTransactionTotalResponseDto {
  @ApiProperty({ example: 50, description: 'Count of orders' })
  cntOrder: number;

  @ApiProperty({ example: 2500000, description: 'Total real shipment price' })
  realShipmentPrice: number;

  @ApiProperty({ example: 500000, description: 'Total discount fee' })
  totalDiscountFee: number;

  @ApiProperty({ example: 25000000, description: 'Total price' })
  totalPrice: number;

  @ApiProperty({
    example: 1250000,
    description: 'Total payment commission amount',
  })
  paymentCommissionAmount: number;

  @ApiProperty({ example: 23750000, description: 'Total received amount' })
  receivedAmount: number;
}
