import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class ParentEntityTypeFilter {
  // @Transform(({ value }) => Number(value))
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    minimum: 1,
    required: false,
    type: Number,
    description: 'parentEntityTypeId',
  })
  public parentEntityTypeId?: number;
}
