import { ApiProperty } from '@nestjs/swagger';

export class ChargingWalletPaymentResponseDto {
  @ApiProperty({ example: 1, description: 'Payment gateway ID' })
  id: number;

  @ApiProperty({
    example: 'Payment Gateway Name',
    description: 'Payment gateway name',
  })
  name: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Image URL',
    required: false,
  })
  imageUrl?: string;
}
