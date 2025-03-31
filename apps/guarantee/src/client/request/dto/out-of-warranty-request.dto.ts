import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class OutOfWarrantyRequestDto {
  @MinLength(10, {
    message: i18nValidationMessage<I18nTranslations>(
      'guarantee.the_min_character_of_request_description',
    ),
  })
  @MaxLength(1024, {
    message: i18nValidationMessage<I18nTranslations>(
      'guarantee.the_max_character_of_request_description',
    ),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>(
      'guarantee.request_description_is_required',
    ),
  })
  @IsString()
  @AutoMap()
  description: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @IsString()
  @AutoMap()
  phoneNumber: string;

  @AutoMap()
  @IsNumber()
  requestTypeId: number;

  @AutoMap()
  @IsNumber()
  addressId: bigint;

  @AutoMap()
  @IsNumber()
  variantId: number;

  @AutoMap()
  @IsNumber()
  productTypeId: number;

  @AutoMap()
  @IsNumber()
  brandId: number;
}
