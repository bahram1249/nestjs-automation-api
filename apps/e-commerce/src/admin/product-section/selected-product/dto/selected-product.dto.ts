import { ApiProperty } from '@nestjs/swagger';
import { replaceCharacterSlug } from '@rahino/commontools';
import { AutoMap } from 'automapper-classes';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SelectedProductDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  title: string;

  @Transform(({ value }) => replaceCharacterSlug(value))
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  slug: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'metaTitle',
  })
  public metaTitle?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'metaKeywords',
  })
  public metaKeywords?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'metaDescription',
  })
  public metaDescription?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description: 'description',
  })
  public description?: string;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'priority',
  })
  public priority?: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'selectedProductTypeId',
  })
  public selectedProductTypeId?: number = 1;
}
