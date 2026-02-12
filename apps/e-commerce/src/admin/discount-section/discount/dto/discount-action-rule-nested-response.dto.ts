import { ApiProperty } from '@nestjs/swagger';

export class DiscountActionRuleNestedResponseDto {
  @ApiProperty({ example: 1, description: 'Discount Action Rule ID' })
  id: number;

  @ApiProperty({
    example: 'First Order',
    description: 'Discount action rule name',
  })
  name: string;
}
