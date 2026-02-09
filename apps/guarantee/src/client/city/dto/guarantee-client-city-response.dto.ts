import { ApiProperty } from '@nestjs/swagger';

export class GuaranteeClientCityProvinceResponseDto {
  @ApiProperty({ example: 1, description: 'Province ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'Province name' })
  name: string;
}

export class GuaranteeClientCityResponseDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name: string;

  @ApiProperty({ example: 'tehran', description: 'City slug', required: false })
  slug?: string;

  @ApiProperty({ example: 1, description: 'Province ID' })
  provinceId: number;

  @ApiProperty({
    example: true,
    description: 'Whether city is neighborhood based',
    required: false,
  })
  neighborhoodBase?: boolean;

  @ApiProperty({
    type: () => GuaranteeClientCityProvinceResponseDto,
    description: 'Province',
    required: false,
  })
  province?: GuaranteeClientCityProvinceResponseDto;
}

export class GuaranteeClientCityListResponseDto {
  @ApiProperty({
    type: [GuaranteeClientCityResponseDto],
    description: 'List of cities',
  })
  result: GuaranteeClientCityResponseDto[];

  @ApiProperty({ example: 10, description: 'Total count' })
  total: number;
}
