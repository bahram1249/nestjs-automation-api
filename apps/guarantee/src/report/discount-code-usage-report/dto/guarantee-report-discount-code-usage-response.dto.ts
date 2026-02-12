import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeReportDiscountCodeUsageDiscountCodeDto {
  @ApiProperty({ example: 'DISCOUNT2024', description: 'Discount code' })
  code: string;

  @ApiProperty({
    example: 'New Year Discount',
    description: 'Discount code title',
  })
  title: string;

  @ApiProperty({ example: 20, description: 'Discount value' })
  discountValue: number;

  @ApiProperty({ example: 50000, description: 'Max discount amount' })
  maxDiscountAmount: number;
}

export class GuaranteeReportDiscountCodeUsageUserDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  lastname: string;

  @ApiProperty({ example: 'johndoe', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email' })
  email: string;
}

export class GuaranteeReportDiscountCodeUsageFactorDto {
  @ApiProperty({ example: 1, description: 'Factor ID' })
  id: number;

  @ApiProperty({ example: 100000, description: 'Total price' })
  totalPrice: number;

  @ApiProperty({
    example: '2024-12-31T00:00:00.000Z',
    description: 'Expire date',
  })
  expireDate: Date;
}

export class GuaranteeReportDiscountCodeUsageItemDto {
  @ApiProperty({ example: 1, description: 'Discount code usage ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Discount code ID' })
  discountCodeId: number;

  @ApiProperty({ example: 1, description: 'User ID' })
  userId: number;

  @ApiProperty({ example: 1, description: 'Factor ID' })
  factorId: number;

  @ApiProperty({ example: 20000, description: 'Discount amount' })
  discountAmount: number;

  @ApiProperty({ example: 50000, description: 'Max discount amount' })
  maxDiscountAmount: number;

  @ApiProperty({ example: '2024-01-15T00:00:00.000Z', description: 'Used at' })
  usedAt: Date;

  @ApiProperty({
    type: GuaranteeReportDiscountCodeUsageDiscountCodeDto,
    description: 'Discount code details',
  })
  discountCode: GuaranteeReportDiscountCodeUsageDiscountCodeDto;

  @ApiProperty({
    type: GuaranteeReportDiscountCodeUsageUserDto,
    description: 'User details',
  })
  user: GuaranteeReportDiscountCodeUsageUserDto;

  @ApiProperty({
    type: GuaranteeReportDiscountCodeUsageFactorDto,
    description: 'Factor details',
  })
  factor: GuaranteeReportDiscountCodeUsageFactorDto;
}

export class GuaranteeReportDiscountCodeUsageListResponseDto {
  @ApiProperty({
    type: [GuaranteeReportDiscountCodeUsageItemDto],
    description: 'List of discount code usage records',
  })
  result: GuaranteeReportDiscountCodeUsageItemDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
