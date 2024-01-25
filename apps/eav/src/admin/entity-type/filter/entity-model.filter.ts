import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class EntityModelFilter {
  // @Transform(({ value }) => Number(value))
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
