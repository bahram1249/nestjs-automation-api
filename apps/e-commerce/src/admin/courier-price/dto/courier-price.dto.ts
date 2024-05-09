import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CourierPriceDto {
  @IsNumber(
    {},
    { message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') },
  )
  @AutoMap()
  baseCourierPrice: number;

  @IsNumber(
    {},
    { message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') },
  )
  @AutoMap()
  courierPriceByKilometre: number;
}
