import { ApiProperty } from '@nestjs/swagger';
import { AdminOrderUserResponseDto } from './user-response.dto';
import { OrderStatusResponseDto } from './order-status-response.dto';
import { OrderShipmentWayResponseDto } from './order-shipmentway-response.dto';
import { AdminOrderAddressResponseDto } from './address-response.dto';
import { OrderDetailResponseDto } from './order-detail-response.dto';

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
    example: 5000,
    description: 'Real shipment price',
    required: false,
  })
  realShipmentPrice?: bigint;

  @ApiProperty({
    example: 1,
    description: 'Order shipment way ID',
    required: false,
  })
  orderShipmentWayId?: number;

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

  @ApiProperty({ example: false, description: 'Is deleted', required: false })
  isDeleted?: boolean;

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

  @ApiProperty({ example: 1, description: 'Courier user ID', required: false })
  courierUserId?: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Delivery date',
    required: false,
  })
  deliveryDate?: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
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
    example: '1402-10-01',
    description: 'Gregorian at Persian date',
    required: false,
  })
  gregorianAtPersian?: string;

  @ApiProperty({
    example: 'Order note',
    description: 'Note description',
    required: false,
  })
  noteDescription?: string;

  @ApiProperty({
    type: () => AdminOrderUserResponseDto,
    description: 'User details',
    required: false,
  })
  user?: AdminOrderUserResponseDto;

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
    type: () => AdminOrderAddressResponseDto,
    description: 'Address details',
    required: false,
  })
  address?: AdminOrderAddressResponseDto;

  @ApiProperty({
    type: () => [OrderDetailResponseDto],
    description: 'Order details',
    required: false,
  })
  details?: OrderDetailResponseDto[];
}
