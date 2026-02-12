import { ApiProperty } from '@nestjs/swagger';

export class LogisticPaymentRequestResultDto {
  @ApiProperty({
    example: 'https://payment-gateway.com/redirect',
    description: 'Redirect URL for payment',
  })
  redirectUrl: string;
}

export class LogisticPaymentGatewayDto {
  @ApiProperty({ example: 1, description: 'Gateway ID' })
  id: number;

  @ApiProperty({ example: 'ZarinPal', description: 'Gateway name' })
  name: string;

  @ApiProperty({
    example: 'https://example.com/gateway.png',
    description: 'Gateway image URL',
  })
  imageUrl: string;

  @ApiProperty({ example: 1, description: 'Variation price ID' })
  variationPriceId: number;

  @ApiProperty({
    example: 'Default Price',
    description: 'Variation price title',
  })
  variationPriceTitle: string;
}
