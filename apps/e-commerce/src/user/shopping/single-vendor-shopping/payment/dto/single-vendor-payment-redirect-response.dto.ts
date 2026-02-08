import { ApiProperty } from '@nestjs/swagger';

export class SingleVendorPaymentRedirectResultDto {
  @ApiProperty({
    example: 'https://payment-gateway.com/pay?token=abc123',
    description: 'Redirect URL for payment',
  })
  redirectUrl: string;
}

export class SingleVendorPaymentRedirectResponseDto {
  @ApiProperty({
    description: 'Payment redirect result',
    type: SingleVendorPaymentRedirectResultDto,
  })
  result: SingleVendorPaymentRedirectResultDto;
}
