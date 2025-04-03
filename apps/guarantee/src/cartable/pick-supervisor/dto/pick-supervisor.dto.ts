import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PickSupervisorDto {
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @IsString()
  description: string;

  @IsNumber()
  userId: bigint;

  @IsDateString()
  superVisorVisitDate: Date;

  @IsString()
  superVisorVisitTime: string;
}
