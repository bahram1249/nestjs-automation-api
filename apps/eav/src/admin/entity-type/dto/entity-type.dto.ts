import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EntityTypeDto {
  @AutoMap()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'name',
  })
  public name: string;

  @AutoMap()
  @IsNumber()
  @ApiProperty({
    required: true,
    type: Number,
    description: 'entityModelId',
  })
  public entityModelId: number;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'parentEntityTypeId',
  })
  public parentEntityTypeId?: number;
}
