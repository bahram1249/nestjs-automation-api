import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from 'automapper-classes';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LinkedEntityTypeBrandDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  title: string;

  @AutoMap()
  @IsNumber()
  entityTypeId: number;

  @AutoMap()
  @IsNumber()
  brandId: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaTitle',
  })
  public metaTitle?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaKeywords',
  })
  public metaKeywords?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaDescription',
  })
  public metaDescription?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'description',
  })
  public description?: string;
}
