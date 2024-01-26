import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class AttributeDto {
  @AutoMap()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'name of attribute',
  })
  public name: string;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'create attribute by entityTypeId',
  })
  public entityTypeId: number;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'attributeTypeId',
  })
  public attributeTypeId: number;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'min length',
  })
  public minLength?: number;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'max length',
  })
  public maxLength?: number;

  @AutoMap()
  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Boolean,
    description: 'is required field?',
  })
  public required?: boolean;
}
