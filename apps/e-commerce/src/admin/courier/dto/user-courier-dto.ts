import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserCourierDto {
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
  @Matches(new RegExp('^([0-9]){4}([0-9]){7,8}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'phoneNumber',
  })
  phoneNumber: string;
}
