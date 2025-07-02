import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class PriceFilterDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'minPrice',
  })
  minPrice?: bigint;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'maxPrice',
  })
  maxPrice?: bigint;
}
