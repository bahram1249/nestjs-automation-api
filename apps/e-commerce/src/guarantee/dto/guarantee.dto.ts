import { ApiProperty } from '@nestjs/swagger';
import { replaceCharacterSlug } from '@rahino/commontools';
import { AutoMap } from 'automapper-classes';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class GuaranteeDto {
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  name: string;

  @Transform(({ value }) => replaceCharacterSlug(value))
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  @AutoMap()
  slug: string;

  @AutoMap()
  @IsOptional()
  description?: string;

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
