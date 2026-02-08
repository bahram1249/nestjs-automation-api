import { ApiProperty } from '@nestjs/swagger';

export class VariationPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Variation price ID' })
  id: number;

  @ApiProperty({
    example: 'Default Price',
    description: 'Variation price name',
  })
  name: string;
}
