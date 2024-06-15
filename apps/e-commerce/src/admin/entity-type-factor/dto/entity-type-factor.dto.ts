import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import {
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class EntityTypeFactorDto {
  @AutoMap()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(256, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  name: string;

  @AutoMap()
  @IsNumber(
    {},
    { message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') },
  )
  entityTypeId: number;

  @AutoMap()
  @IsNumber(
    {},
    { message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') },
  )
  @IsOptional()
  priority?: number;
}
