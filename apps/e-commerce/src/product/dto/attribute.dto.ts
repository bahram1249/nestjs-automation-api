import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional } from 'class-validator';

export class AttributeDto {
  @ApiProperty({
    required: false,
    type: Number,
    description: 'attributeId',
  })
  @IsInt()
  @Type(() => Number)
  attributeId: number;

  @ApiProperty({
    required: false,
    type: [Number],
    description: 'attributeValues',
  })
  @IsArray()
  @IsInt({ each: true })
  attributeValues: number[];
}
