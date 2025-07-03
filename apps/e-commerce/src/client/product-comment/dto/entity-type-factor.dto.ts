import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { IsNumber, Max, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class UserEntityTypeFactorDto {
  @AutoMap()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
    },
  )
  id: number;

  @AutoMap()
  @Max(5, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @Min(1, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
    },
  )
  score: number;
}
