import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class AttributeValueFilter {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 0,
    required: false,
    default: 0,
    type: IsNumber,
    description: 'attributeId',
  })
  public attributeId?: bigint;
}
