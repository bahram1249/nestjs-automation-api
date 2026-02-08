import { ApiProperty } from '@nestjs/swagger';

export class PaymentGatewayResponseDto {
  @ApiProperty({ example: 1, description: 'Payment gateway ID' })
  id: number;

  @ApiProperty({ example: 'zarinpal', description: 'Payment gateway name' })
  name: string;

  @ApiProperty({
    example: 'Pay with Zarinpal',
    description: 'Title message for the payment gateway',
    required: false,
  })
  titleMessage?: string;

  @ApiProperty({
    example: 'Secure payment via Zarinpal',
    description: 'Description of the payment gateway',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 'https://example.com/payment-logo.png',
    description: 'Image URL for the payment gateway',
    required: false,
  })
  imageUrl?: string;
}
