import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class EntityModelFilter {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    minimum: 1,
    required: false,
    default: 1,
    type: Number,
    description: 'entityModelId',
  })
  public entityModelId?: number = 1;
}
