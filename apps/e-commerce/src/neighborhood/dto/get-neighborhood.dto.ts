import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetNeighborhoodDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    default: 0,
    type: IsNumber,
    description: 'filter base cityId',
  })
  public cityId: number;
}
