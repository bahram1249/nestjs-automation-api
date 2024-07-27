import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ProductFavoriteDto {
  @AutoMap()
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
    },
  )
  productId: bigint;
}
