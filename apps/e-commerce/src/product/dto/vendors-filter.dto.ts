import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsNumber, IsOptional } from 'class-validator';

export class VendorsFilterDto {
  @ApiProperty({
    name: 'vendorIds',
    required: false,
    type: [Number],
    description: 'vendorIds',
  })
  @IsOptional()
  @IsArray()
  @Transform((item) =>
    typeof item.value.map === 'function'
      ? item.value.map((v) => parseInt(v, 10))
      : [parseInt(item.value, 10)],
  )
  @IsInt({ each: true })
  vendorIds?: number[] = [];
}
