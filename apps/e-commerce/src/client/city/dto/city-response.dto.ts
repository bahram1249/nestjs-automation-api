import { ApiProperty } from '@nestjs/swagger';
import { ProvinceResponseDto } from '@rahino/ecommerce/client/province/dto/province-response.dto';

export class CityResponseDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name: string;

  @ApiProperty({ example: 'tehran', description: 'City slug' })
  slug: string;

  @ApiProperty({ example: 1, description: 'Province ID' })
  provinceId: number;

  @ApiProperty({
    example: true,
    description: 'Whether city is neighborhood based',
    required: false,
  })
  neighborhoodBase?: boolean;

  @ApiProperty({
    type: ProvinceResponseDto,
    description: 'Province information',
    required: false,
  })
  province?: ProvinceResponseDto;
}
