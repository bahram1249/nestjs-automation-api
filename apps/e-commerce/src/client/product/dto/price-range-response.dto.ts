import { ApiProperty } from '@nestjs/swagger';

export class PriceRangeResponseDto {
  @ApiProperty({ example: 0, description: 'Minimum price' })
  minPrice: number;

  @ApiProperty({ example: 10000000, description: 'Maximum price' })
  maxPrice: number;
}
