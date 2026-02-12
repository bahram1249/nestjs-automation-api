import { ApiProperty } from '@nestjs/swagger';
import { PaymentGatewayResponseDto } from './payment-gateway-response.dto';
import { PaymentStatusResponseDto } from './payment-status-response.dto';
import { PaymentTypeResponseDto } from './payment-type-response.dto';

export class PaymentResponseDto {
  @ApiProperty({ example: 1, description: 'Payment ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Payment Gateway ID' })
  paymentGatewayId: number;

  @ApiProperty({ example: 1, description: 'Payment Type ID' })
  paymentTypeId: number;

  @ApiProperty({ example: 1, description: 'Payment Status ID' })
  paymentStatusId: number;

  @ApiProperty({ example: 100000, description: 'Total price', required: false })
  totalprice?: bigint;

  @ApiProperty({ example: 1, description: 'Order ID', required: false })
  orderId?: bigint;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: bigint;

  @ApiProperty({
    example: false,
    description: 'Is deleted flag',
    required: false,
  })
  isDeleted?: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Created at',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Updated at',
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => PaymentTypeResponseDto,
    description: 'Payment type details',
    required: false,
  })
  paymentType?: PaymentTypeResponseDto;

  @ApiProperty({
    type: () => PaymentStatusResponseDto,
    description: 'Payment status details',
    required: false,
  })
  paymentStatus?: PaymentStatusResponseDto;

  @ApiProperty({
    type: () => PaymentGatewayResponseDto,
    description: 'Payment gateway details',
    required: false,
  })
  paymentGateway?: PaymentGatewayResponseDto;
}
