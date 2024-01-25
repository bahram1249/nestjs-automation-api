import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class AttributeEntityFilter {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    minimum: 1,
    required: false,
    type: IsNumber,
    description: 'entity type id',
  })
  public entityTypeId?: number;
}
