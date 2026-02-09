import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeAdminDiscountCodeUnitPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Unit Price ID' })
  id: number;

  @ApiProperty({ example: 'Toman', description: 'Unit price title' })
  title: string;
}

export class GuaranteeAdminDiscountCodeResponseDto {
  @ApiProperty({ example: 1, description: 'Discount Code ID' })
  id: bigint;

  @ApiProperty({ example: 'CODE123', description: 'Discount code' })
  code: string;

  @ApiProperty({
    example: 'Discount Title',
    description: 'Discount code title',
  })
  title: string;

  @ApiProperty({ example: 1, description: 'Discount type ID' })
  discountTypeId: number;

  @ApiProperty({ example: 10000, description: 'Discount value' })
  discountValue: bigint;

  @ApiProperty({ example: 1, description: 'Unit price ID' })
  unitPriceId: number;

  @ApiProperty({
    type: GuaranteeAdminDiscountCodeUnitPriceResponseDto,
    description: 'Unit price',
    required: false,
  })
  unitPrice?: GuaranteeAdminDiscountCodeUnitPriceResponseDto;

  @ApiProperty({ example: 100, description: 'Total usage limit' })
  totalUsageLimit: number;

  @ApiProperty({ example: 1, description: 'Per user usage limit' })
  perUserUsageLimit: number;

  @ApiProperty({ example: 50000, description: 'Maximum discount amount' })
  maxDiscountAmount: bigint;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Valid from date',
  })
  validFrom: Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'Valid until date',
  })
  validUntil: Date;

  @ApiProperty({ example: true, description: 'Is active' })
  isActive: boolean;

  @ApiProperty({
    example: 'Description',
    description: 'Discount code description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}

export class GuaranteeAdminDiscountCodeListResponseDto {
  @ApiProperty({
    type: [GuaranteeAdminDiscountCodeResponseDto],
    description: 'List of discount codes',
  })
  result: GuaranteeAdminDiscountCodeResponseDto[];

  @ApiProperty({ example: 100, description: 'Total count' })
  total: number;
}

export class GuaranteeAdminDiscountCodeSingleResponseDto {
  @ApiProperty({
    type: GuaranteeAdminDiscountCodeResponseDto,
    description: 'Discount code',
  })
  result: GuaranteeAdminDiscountCodeResponseDto;
}
