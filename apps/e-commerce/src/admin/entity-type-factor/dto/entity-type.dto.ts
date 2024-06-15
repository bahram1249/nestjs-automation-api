import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';

export class EntityTypeDto {
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    required: true,
    default: false,
    type: IsNumber,
    description: 'entityTypeId',
  })
  entityTypeId: number;
}
