import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsNumber, IsOptional } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { ListFilter } from '@rahino/query-filter';

export class UserActionReportDto {
  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'organizationId',
  })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
  })
  @Type(() => Number)
  organizationId?: number;
}

export class GetUserActionReportDto extends IntersectionType(
  UserActionReportDto,
  ListFilter,
) {}
