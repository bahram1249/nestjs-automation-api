import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AttributeDto {
  @AutoMap()
  @IsString()
  @ApiProperty({
    minimum: 0,
    required: true,
    default: 0,
    type: IsString,
    description: 'name of attribute',
  })
  public name: string;

  @IsNumber()
  @ApiProperty({
    required: true,
    type: IsNumber,
    description: 'create attribute by entityTypeId',
  })
  public entityTypeId: number;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: IsNumber,
    description: 'attributeTypeId',
  })
  public attributeTypeId: number;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'min length',
  })
  public minLength?: number;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'max length',
  })
  public maxLength?: number;

  @AutoMap()
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: IsBoolean,
    description: 'is required field?',
  })
  public required?: boolean;
}
