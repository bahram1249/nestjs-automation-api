import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class ParentEntityTypeFilter {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 0,
    required: false,
    default: 0,
    type: Number,
    description: 'parentEntityTypeId',
  })
  public parentEntityTypeId?: number;
}
