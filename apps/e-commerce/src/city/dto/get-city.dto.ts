import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetCityDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: 0,
    type: IsNumber,
    description: 'filter base provinceId',
  })
  public provinceId: number;
}
