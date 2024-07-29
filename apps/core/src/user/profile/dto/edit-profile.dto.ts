import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class EditProfileDto {
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
  firstname: string;

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
  lastname: string;

  @AutoMap()
  @IsDateString()
  @IsOptional()
  birthDate?: Date;
}
