import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class EntityModelFilter {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 0,
    required: false,
    default: 0,
    type: Number,
    description: 'entityModelId',
  })
  public entityModelId?: number;
}
