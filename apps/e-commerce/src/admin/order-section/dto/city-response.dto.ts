import { ApiProperty } from '@nestjs/swagger';
import { ProvinceResponseDto } from './province-response.dto';

export class CityResponseDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name: string;

  @ApiProperty({ example: 'tehran', description: 'City slug', required: false })
  slug?: string;

  @ApiProperty({ example: 1, description: 'Province ID' })
  provinceId: number;

  @ApiProperty({
    type: () => ProvinceResponseDto,
    description: 'Province details',
    required: false,
  })
  province?: ProvinceResponseDto;
}
