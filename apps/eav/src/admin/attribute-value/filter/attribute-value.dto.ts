import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class AttributeValueFilter {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    minimum: 1,
    required: false,
    type: IsNumber,
    description: 'attributeId',
  })
  public attributeId?: bigint;
}
