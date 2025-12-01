import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class ProductIdsFilterDto {
  @ApiProperty({
    name: 'productIds',
    required: false,
    type: [Number],
    description: 'productIds',
  })
  @IsOptional()
  @IsArray()
  @Transform((item) =>
    typeof item.value.map === 'function'
      ? item.value.map((v) => parseInt(v, 10))
      : [parseInt(item.value, 10)],
  )
  @IsInt({ each: true })
  productIds?: number[] = [];
}
