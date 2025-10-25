import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import {
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AddressDto {
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(512, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('ecommerce.address_name'),
  })
  @AutoMap()
  name: string;

  @AutoMap()
  @IsString()
  latitude: string;

  @AutoMap()
  @IsString()
  longitude: string;

  @AutoMap()
  @IsNumber()
  provinceId: number;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  cityId?: number;

  // @AutoMap()
  // @IsNumber()
  // @IsOptional()
  // neighborhoodId?: number;

  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(1024, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'ecommerce.address_street',
    ),
  })
  @AutoMap()
  street: string;

  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(1024, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsOptional()
  @AutoMap()
  alley?: string;

  @IsOptional()
  @AutoMap()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'ecommerce.address_plaque',
    ),
  })
  plaque?: string;

  @IsOptional()
  @AutoMap()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('ecommerce.address_floor'),
  })
  floorNumber?: string;

  @AutoMap()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>(
      'ecommerce.address_postalcode',
    ),
  })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>(
      'ecommerce.address_postalcode',
    ),
  })
  @MaxLength(512, {
    message: i18nValidationMessage<I18nTranslations>(
      'ecommerce.address_postalcode',
    ),
  })
  postalCode: string;
}
