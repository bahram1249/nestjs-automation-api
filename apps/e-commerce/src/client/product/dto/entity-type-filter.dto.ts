import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class EntityTypeFilterDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    minimum: 1,
    required: false,
    type: IsNumber,
    description: 'entityTypeId',
  })
  entityTypeId?: number;
}
