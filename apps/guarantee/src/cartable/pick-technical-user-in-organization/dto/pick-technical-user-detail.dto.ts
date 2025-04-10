import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PickTechnicalUserDetailDto {
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @IsString()
  description: string;

  @IsNumber()
  userId: bigint;
}
