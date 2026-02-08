import { ApiProperty } from '@nestjs/swagger';

export class DiscountConditionTypeNestedResponseDto {
  @ApiProperty({ example: 1, description: 'Condition Type ID' })
  id: number;

  @ApiProperty({ example: 'Vendor', description: 'Condition type name' })
  name: string;
}
