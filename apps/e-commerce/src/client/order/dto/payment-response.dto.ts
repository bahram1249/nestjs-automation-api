import { ApiProperty } from '@nestjs/swagger';

export class PaymentResponseDto {
  @ApiProperty({ example: 1, description: 'Payment ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Payment gateway ID' })
  paymentGatewayId: number;

  @ApiProperty({ example: 100000, description: 'Total price', required: false })
  totalprice?: bigint;
}
