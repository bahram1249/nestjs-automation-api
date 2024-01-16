import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString } from 'class-validator';

export class AttributeValueDto {
  @AutoMap()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'value of attribute',
  })
  public value: string;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'create attribute value by attributeId',
  })
  public attributeId: bigint;
}
