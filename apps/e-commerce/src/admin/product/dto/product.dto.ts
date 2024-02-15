import { replaceCharacterSlug } from '@rahino/commontools';
import { AutoMap } from 'automapper-classes';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ProductPhotoDto } from './product-photo.dto';
import { ProductAttributeDto } from './product-attribute.dto';
import { InventoryDto } from '@rahino/ecommerce/inventory/dto';

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
  @IsOptional()
  brandId?: number;

  @AutoMap()
  @IsString()
  @IsOptional()
  description?: string;

  @AutoMap()
  @IsBoolean()
  @IsOptional()
  colorBased?: boolean;

  @IsArray()
  @IsOptional()
  photos?: ProductPhotoDto[];

  @IsArray()
  @IsOptional()
  attributes?: ProductAttributeDto[];

  @IsArray()
  @IsOptional()
  inventories?: InventoryDto[];
}
