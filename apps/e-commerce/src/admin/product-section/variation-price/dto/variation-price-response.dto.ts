import { ApiProperty } from '@nestjs/swagger';

export class VariationPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Variation Price ID' })
  id: number;

  @ApiProperty({ example: 'Color', description: 'Variation Name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is Required', required: false })
  required?: boolean;
}
