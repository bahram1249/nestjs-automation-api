import { ApiProperty } from '@nestjs/swagger';
import { CityResponseDto } from '@rahino/ecommerce/client/city/dto/city-response.dto';

export class NeighborhoodResponseDto {
  @ApiProperty({ example: 1, description: 'Neighborhood ID' })
  id: number;

  @ApiProperty({ example: 'District 1', description: 'Neighborhood name' })
  name: string;

  @ApiProperty({
    example: 'district-1',
    description: 'Neighborhood slug',
    required: false,
  })
  slug?: string;

  @ApiProperty({ example: 1, description: 'City ID' })
  cityId: number;

  @ApiProperty({
    type: CityResponseDto,
    description: 'City information',
    required: false,
  })
  city?: CityResponseDto;
}
