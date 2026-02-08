import { ApiProperty } from '@nestjs/swagger';

export class DiscountTypeNestedResponseDto {
  @ApiProperty({ example: 1, description: 'Discount Type ID' })
  id: number;

  @ApiProperty({ example: 'Percentage', description: 'Discount type name' })
  name: string;

  @ApiProperty({
    example: true,
    description: 'Whether the discount type is coupon based',
    required: false,
  })
  isCouponBased?: boolean;
}
