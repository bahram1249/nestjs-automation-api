import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ClientLogisticPeriodDto {
  @AutoMap()
  @IsNumber(
    {},
    { message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') },
  )
  addressId: bigint;
}
