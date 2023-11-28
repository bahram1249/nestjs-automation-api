import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class AttributeEntityDto {
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

  @IsNumber()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'min length',
  })
  public minLength?: number;

  @IsNumber()
  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'max length',
  })
  public maxLength?: number;

  @IsBoolean()
  @ApiProperty({
    required: false,
    type: IsBoolean,
    description: 'is required field?',
  })
  public required?: boolean;
}
