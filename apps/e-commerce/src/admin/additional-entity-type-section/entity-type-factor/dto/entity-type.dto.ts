import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

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
