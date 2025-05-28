import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class RejectRequestDto {
  @IsOptional()
  @IsString()
  description: string;
}
