import { ApiProperty } from '@nestjs/swagger';

export class DiscountActionTypeNestedResponseDto {
  @ApiProperty({ example: 1, description: 'Discount Action Type ID' })
  id: number;

  @ApiProperty({
    example: 'Percentage Off',
    description: 'Discount action type name',
  })
  name: string;
}
