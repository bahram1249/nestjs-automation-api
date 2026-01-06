import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { i18nValidationMessage } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { ListFilter } from '@rahino/query-filter';

export class DiscountCodeUsageReportDto {
  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @ApiProperty({
    required: false,
    type: String,
    description: 'discount code',
  })
  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  discountCode?: string;

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

  @ApiProperty({
    required: false,
    type: IsInt,
    description: 'organizationId',
  })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
  })
  @Type(() => Number)
  organizationId?: number;
}

export class GetDiscountCodeUsageReportDto extends IntersectionType(
  DiscountCodeUsageReportDto,
  ListFilter,
) {}
