import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachmentDto } from './attachment.dto';

export class ConfirmDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsArray()
  attachments: AttachmentDto[] = [];
}
