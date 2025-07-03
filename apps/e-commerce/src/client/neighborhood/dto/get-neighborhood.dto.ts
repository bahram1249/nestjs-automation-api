import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class GetNeighborhoodDto {
  @Transform(({ value }) => Number(value))
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
