import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class PickTechnicalUserDetailDto {
  @IsOptional()
  @IsString()
  description: string;

  @IsNumber()
  userId: bigint;

  @IsDateString()
  technicalUserVisitDate: Date;

  @IsString()
  technicalUserVisitTime: string;
}
