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
import { ProductAttachmentDto } from './product-attachment.dto';
import { ProductAttributeDto } from './product-attribute.dto';
import { InventoryDto } from '@rahino/ecommerce/shared/inventory/dto';
import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ProductDto {
  @AutoMap()
  @IsString()
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(512, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  title: string;

  @AutoMap()
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(512, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @Transform(({ value }) => replaceCharacterSlug(value))
  slug: string;

  @AutoMap()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
    },
  )
  entityTypeId: number;

  @AutoMap()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
    },
  )
  publishStatusId: number;

  @AutoMap()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
    },
  )
  @IsOptional()
  brandId?: number;

  @AutoMap()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  @IsOptional()
  description?: string;

  @AutoMap()
  @IsBoolean({
    message: i18nValidationMessage<I18nTranslations>(
      'validation.INVALID_BOOLEAN',
    ),
  })
  @IsOptional()
  colorBased?: boolean;

  @IsArray()
  @IsOptional()
  photos?: ProductAttachmentDto[];

  @IsArray()
  @IsOptional()
  videos?: ProductAttachmentDto[];

  @IsArray()
  @IsOptional()
  attributes?: ProductAttributeDto[];

  @IsArray()
  @IsOptional()
  inventories?: InventoryDto[];

  @AutoMap()
  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaTitle',
  })
  public metaTitle?: string;

  @AutoMap()
  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaKeywords',
  })
  public metaKeywords?: string;

  @AutoMap()
  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  @ApiProperty({
    required: true,
    type: String,
    description: 'metaDescription',
  })
  public metaDescription?: string;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  productFormulaId?: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  wages?: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  stoneMoney?: bigint;
}
