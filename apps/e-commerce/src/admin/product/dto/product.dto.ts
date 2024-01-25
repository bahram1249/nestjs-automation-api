import { replaceCharacterSlug } from '@rahino/commontools';
import { AutoMap } from 'automapper-classes';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProductPhotoDto } from './product-photo.dto';
import { ProductAttributeDto } from './product-attribute.dto';

export class ProductDto {
  @AutoMap()
  @IsString()
  @MinLength(3)
  @MaxLength(512)
  @IsNotEmpty()
  title: string;

  @AutoMap()
  @MinLength(3)
  @MaxLength(512)
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => replaceCharacterSlug(value))
  slug: string;

  @AutoMap()
  @IsNumber()
  entityTypeId: number;

  @AutoMap()
  @IsNumber()
  publishStatusId: number;

  @AutoMap()
  @IsNumber()
  brandId?: number;

  @AutoMap()
  @IsString()
  description?: string;

  @AutoMap()
  @IsBoolean()
  colorBased?: boolean;

  @IsArray()
  photos?: ProductPhotoDto[];

  @IsArray()
  attributes?: ProductAttributeDto[];
}
