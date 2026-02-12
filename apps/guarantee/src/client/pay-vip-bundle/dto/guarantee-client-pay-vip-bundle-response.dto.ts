import { ApiProperty } from '@nestjs/swagger';
import { GSRequestPaymentOutputTypeEnum } from '@rahino/guarantee/shared/payment/dto/gs-request-payment-output-type.dto';

export class GuaranteeClientPayVipBundlePreviewDto {
  @ApiProperty({ example: 1, description: 'Discount code ID' })
  discountCodeId: number;

  @ApiProperty({ example: 'DISCOUNT10', description: 'Discount code' })
  discountCode: string;

  @ApiProperty({ example: 100000, description: 'Original price' })
  originalPrice: number;

  @ApiProperty({ example: 10000, description: 'Discount amount' })
  discountAmount: number;

  @ApiProperty({ example: 90000, description: 'Final price' })
  finalPrice: number;

  @ApiProperty({ example: 90000, description: 'User pay amount' })
  userPayAmount: number;

  @ApiProperty({ example: true, description: 'Can apply discount' })
  canApply: boolean;

  @ApiProperty({
    example: 'Error message',
    description: 'Error message if any',
    required: false,
  })
  error?: string;
}

export class GuaranteeClientPayVipBundlePreviewResponseDto {
  @ApiProperty({
    type: GuaranteeClientPayVipBundlePreviewDto,
    description: 'Preview result',
  })
  result: GuaranteeClientPayVipBundlePreviewDto;
}

export class GuaranteeClientPayVipBundlePaymentOptionDto {
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

export class GuaranteeClientPayVipBundleCreateResponseDto {
  @ApiProperty({
    type: GuaranteeClientPayVipBundlePaymentOptionDto,
    description: 'Payment result',
  })
  result: GuaranteeClientPayVipBundlePaymentOptionDto;
}
