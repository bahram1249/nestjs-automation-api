import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class SetOrganizationDto {
  @IsNumber()
  organizationId: number;

  @IsOptional()
  @IsString()
  description: string;
}
