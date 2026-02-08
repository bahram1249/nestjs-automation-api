import { ApiProperty } from '@nestjs/swagger';

export class VariationPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Variation Price ID' })
  id: number;

  @ApiProperty({ example: 'Base Price', description: 'Variation Price Name' })
  name: string;

  @ApiProperty({ example: true, description: 'Is required', required: false })
  required?: boolean;
}
