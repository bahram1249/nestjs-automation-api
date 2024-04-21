import { ApiProperty } from '@nestjs/swagger';
import { replaceCharacterSlug } from '@rahino/commontools';
import { AutoMap } from 'automapper-classes';
import { Transform } from 'class-transformer';
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
  @Transform(({ value }) => replaceCharacterSlug(value))
  @IsString()
  @ApiProperty({
    required: true,
    type: String,
    description: 'slug is a unique url',
  })
  public slug: string;

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
}
