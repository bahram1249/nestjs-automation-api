import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientNeighborhoodCityResponseDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name: string;
}

export class GuaranteeClientNeighborhoodResponseDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({
    example: 'Neighborhood Name',
    description: 'Neighborhood name',
  })
  name: string;

  @ApiProperty({
    example: 'neighborhood-slug',
    description: 'Neighborhood slug',
    required: false,
  })
  slug?: string;

  @ApiProperty({ example: 1, description: 'City ID' })
  cityId: number;

  @ApiProperty({
    type: () => GuaranteeClientNeighborhoodCityResponseDto,
    description: 'City',
    required: false,
  })
  city?: GuaranteeClientNeighborhoodCityResponseDto;
}

export class GuaranteeClientNeighborhoodListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientNeighborhoodResponseDto],
    description: 'List of neighborhoods',
  })
  result: GuaranteeClientNeighborhoodResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
