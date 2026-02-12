import { ApiProperty } from '@nestjs/swagger';
import { DiscountTypeNestedResponseDto } from './discount-type-nested-response.dto';
import { DiscountActionTypeNestedResponseDto } from './discount-action-type-nested-response.dto';
import { DiscountActionRuleNestedResponseDto } from './discount-action-rule-nested-response.dto';

export class DiscountResponseDto {
  @ApiProperty({ example: 1, description: 'Discount ID' })
  id: bigint;

  @ApiProperty({ example: 'Summer Sale', description: 'Discount name' })
  name: string;

  @ApiProperty({
    example: 'Summer sale discount for all products',
    description: 'Discount description',
    required: false,
  })
  description?: string;

  @ApiProperty({ example: 1, description: 'Discount Type ID' })
  discountTypeId: number;

  @ApiProperty({
    example: 1,
    description: 'Discount Action Type ID',
    required: false,
  })
  discountActionTypeId?: number;

  @ApiProperty({
    example: 10.5,
    description: 'Discount value',
    required: false,
  })
  discountValue?: number;

  @ApiProperty({
    example: 100,
    description: 'Maximum discount value',
    required: false,
  })
  maxValue?: number;

  @ApiProperty({
    example: 1,
    description: 'Discount Action Rule ID',
    required: false,
  })
  discountActionRuleId?: number;

  @ApiProperty({
    example: 'SUMMER2024',
    description: 'Coupon code',
    required: false,
  })
  couponCode?: string;

  @ApiProperty({ example: 1, description: 'Priority', required: false })
  priority?: number;

  @ApiProperty({ example: 100, description: 'Usage limit', required: false })
  limit?: number;

  @ApiProperty({
    example: 10,
    description: 'Number of times used',
    required: false,
  })
  used?: number;

  @ApiProperty({
    example: true,
    description: 'Whether the discount is active',
    required: false,
  })
  isActive?: boolean;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: 'Start date',
    required: false,
  })
  startDate?: Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'End date',
    required: false,
  })
  endDate?: Date;

  @ApiProperty({
    example: true,
    description: 'Whether free shipment is included',
    required: false,
  })
  freeShipment?: boolean;

  @ApiProperty({
    type: () => DiscountTypeNestedResponseDto,
    description: 'Discount type details',
    required: false,
  })
  discountType?: DiscountTypeNestedResponseDto;

  @ApiProperty({
    type: () => DiscountActionTypeNestedResponseDto,
    description: 'Discount action type details',
    required: false,
  })
  actionType?: DiscountActionTypeNestedResponseDto;

  @ApiProperty({
    type: () => DiscountActionRuleNestedResponseDto,
    description: 'Discount action rule details',
    required: false,
  })
  actionRule?: DiscountActionRuleNestedResponseDto;
}
