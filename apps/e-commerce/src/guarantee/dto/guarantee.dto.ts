import { ApiProperty } from '@nestjs/swagger';
import { replaceCharacterSlug } from '@rahino/commontools';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class GuaranteeDto {
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(256, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @AutoMap()
  name: string;

  @Transform(({ value }) => replaceCharacterSlug(value))
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(256, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @AutoMap()
  slug: string;

  @AutoMap()
  @IsOptional()
  description?: string;

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
}
