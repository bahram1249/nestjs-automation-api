import { ApiProperty } from '@nestjs/swagger';

export class PaymentGatewayResponseDto {
  @ApiProperty({ example: 1, description: 'Payment Gateway ID' })
  id: number;

  @ApiProperty({ example: 'Zarinpal', description: 'Payment gateway name' })
  name: string;
}
