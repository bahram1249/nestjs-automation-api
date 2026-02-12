import { ApiProperty } from '@nestjs/swagger';
import { PaymentGatewayResponseDto } from '../../transaction/dto/payment-gateway-response.dto';

export class OrderPaymentResponseDto {
  @ApiProperty({ example: 1, description: 'Payment ID' })
  id: bigint;

  @ApiProperty({ example: 100000, description: 'Total price', required: false })
  totalprice?: bigint;

  @ApiProperty({ example: 1, description: 'Payment Gateway ID' })
  paymentGatewayId: number;

  @ApiProperty({
    type: () => PaymentGatewayResponseDto,
    description: 'Payment gateway details',
    required: false,
  })
  paymentGateway?: PaymentGatewayResponseDto;
}
