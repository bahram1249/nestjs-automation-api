import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class AttributeEntityFilter {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 0,
    required: false,
    default: 0,
    type: IsNumber,
    description: 'entity type id',
  })
  entityTypeId?: number;
}
