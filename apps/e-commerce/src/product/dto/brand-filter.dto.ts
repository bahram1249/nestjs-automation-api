import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional } from 'class-validator';

export class BrandFilterDto {
  @ApiProperty({
    name: 'brands',
    required: false,
    type: [Number],
    description: 'brands',
  })
  @IsOptional()
  @IsArray()
  @Transform((item) =>
    typeof item.value.map === 'function'
      ? item.value.map((v) => parseInt(v, 10))
      : [parseInt(item.value, 10)],
  )
  @IsInt({ each: true })
  brands?: number[] = [];
}
