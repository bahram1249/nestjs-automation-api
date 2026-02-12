import { ApiProperty } from '@nestjs/swagger';
import { GSRequestPaymentOutputTypeEnum } from '@rahino/guarantee/shared/payment/dto/gs-request-payment-output-type.dto';

export class GuaranteeClientPayAdditionalPackagePaymentOptionDto {
  @ApiProperty({ example: 'redirect', description: 'Redirect type' })
  redirectType: GSRequestPaymentOutputTypeEnum;

  @ApiProperty({
    type: Object,
    description: 'Additional data',
    required: false,
  })
  data?: any;

  @ApiProperty({
    example: 'https://example.com/pay',
    description: 'Redirect URL',
  })
  redirectUrl: string;
}

export class GuaranteeClientPayAdditionalPackageResponseDto {
  @ApiProperty({
    type: GuaranteeClientPayAdditionalPackagePaymentOptionDto,
    description: 'Payment result',
  })
  result: GuaranteeClientPayAdditionalPackagePaymentOptionDto;
}
