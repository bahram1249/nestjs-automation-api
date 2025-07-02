import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class EntityTypeFilter {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'entityTypeId',
  })
  public entityTypeId?: number;
}
