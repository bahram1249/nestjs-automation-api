import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { ListFilter } from '@rahino/query-filter';

export class RewardHistoryReportDto {
  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @ApiProperty({
    required: false,
    type: String,
    description: 'original guarantee serial number',
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  originalGuaranteeSerialNumber?: string;

  @ApiProperty({
    required: false,
    type: String,
    description: 'user full name',
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  userFullName?: string;
}

export class GetRewardHistoryReportDto extends IntersectionType(
  RewardHistoryReportDto,
  ListFilter,
) {}
