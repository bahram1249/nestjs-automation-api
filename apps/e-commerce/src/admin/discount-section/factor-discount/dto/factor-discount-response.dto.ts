import { ApiProperty } from '@nestjs/swagger';
import { DiscountTypeNestedResponseDto } from '../../discount/dto/discount-type-nested-response.dto';
import { DiscountActionTypeNestedResponseDto } from '../../discount/dto/discount-action-type-nested-response.dto';
import { DiscountActionRuleNestedResponseDto } from '../../discount/dto/discount-action-rule-nested-response.dto';

export class FactorDiscountResponseDto {
  @ApiProperty({ example: 1, description: 'Factor Discount ID' })
  id: bigint;

  @ApiProperty({ example: 'Factor Discount', description: 'Discount name' })
  name: string;

  @ApiProperty({
    example: 'Factor based discount description',
    description: 'Discount description',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 5,
    description: 'Discount Type ID (always 5 for factor discounts)',
  })
  discountTypeId: number;

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
    example: 1000,
    description: 'Minimum price for discount',
    required: false,
  })
  minPrice?: bigint;

  @ApiProperty({
    example: 10000,
    description: 'Maximum price for discount',
    required: false,
  })
  maxPrice?: bigint;

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
