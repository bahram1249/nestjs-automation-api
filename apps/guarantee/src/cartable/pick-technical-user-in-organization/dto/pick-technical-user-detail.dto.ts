import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PickTechnicalUserDetailDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  userId: bigint;
}
