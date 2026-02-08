import { ApiProperty } from '@nestjs/swagger';
import { ProvinceResponseDto } from './province-response.dto';

export class CityResponseDto {
  @ApiProperty({ example: 1, description: 'City ID' })
  id: number;

  @ApiProperty({ example: 'Tehran', description: 'City name' })
  name: string;

  @ApiProperty({
    description: 'Province information',
    required: false,
    type: ProvinceResponseDto,
  })
  province?: ProvinceResponseDto;
}
