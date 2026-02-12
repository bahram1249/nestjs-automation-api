import { ApiProperty } from '@nestjs/swagger';

export class PaymentRedirectResultDto {
  @ApiProperty({
    example: 'https://payment-gateway.com/pay?token=abc123',
    description: 'Redirect URL for payment',
  })
  redirectUrl: string;
}

export class PaymentRedirectResponseDto {
  @ApiProperty({
    description: 'Payment redirect result',
    type: PaymentRedirectResultDto,
  })
  result: PaymentRedirectResultDto;
}
