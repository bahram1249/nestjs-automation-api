import { ApiProperty } from '@nestjs/swagger';

export class DiscountConditionTypeResponseDto {
  @ApiProperty({ example: 1, description: 'Discount Condition Type ID' })
  id: number;

  @ApiProperty({
    example: 'Vendor',
    description: 'Discount condition type name',
  })
  name: string;
}
