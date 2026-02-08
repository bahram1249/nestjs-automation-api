import { ApiProperty } from '@nestjs/swagger';
import { DiscountConditionTypeNestedResponseDto } from './discount-condition-type-nested-response.dto';

export class DiscountConditionResponseDto {
  @ApiProperty({ example: 1, description: 'Discount Condition ID' })
  id: bigint;

  @ApiProperty({ example: 1, description: 'Discount ID' })
  discountId: bigint;

  @ApiProperty({ example: 1, description: 'Condition Type ID' })
  conditionTypeId: number;

  @ApiProperty({ example: 1, description: 'Condition Value' })
  conditionValue: bigint;

  @ApiProperty({
    example: true,
    description: 'Whether this is a default condition',
    required: false,
  })
  isDefault?: boolean;

  @ApiProperty({
    example: 'Vendor Name',
    description: 'Name of the condition value',
    required: false,
  })
  name?: string;

  @ApiProperty({
    type: () => DiscountConditionTypeNestedResponseDto,
    description: 'Condition type details',
    required: false,
  })
  conditionType?: DiscountConditionTypeNestedResponseDto;
}
