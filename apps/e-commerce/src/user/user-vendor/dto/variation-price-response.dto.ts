import { ApiProperty } from '@nestjs/swagger';

export class VariationPriceResponseDto {
  @ApiProperty({ example: 1, description: 'Variation Price ID' })
  id: number;

  @ApiProperty({ example: 'Price Name', description: 'Variation price name' })
  name: string;
}
