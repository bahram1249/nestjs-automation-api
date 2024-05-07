import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ProductAttributeDto {
  @AutoMap()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
    },
  )
  id: bigint;

  @AutoMap()
  // @IsNumber()
  @IsString({
    each: true,
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  val: string;
}
