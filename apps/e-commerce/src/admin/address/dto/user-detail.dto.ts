import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserDetailDto {
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(512, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsOptional()
  @AutoMap()
  phoneNumber?: string;
}
