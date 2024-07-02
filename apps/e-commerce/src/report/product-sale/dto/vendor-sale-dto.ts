import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VendorSaleDto {
  @ApiProperty({
    required: true,
    type: IsString,
    description: 'beginDate',
  })
  @IsString()
  beginDate: string;

  @ApiProperty({
    required: true,
    type: IsString,
    description: 'endDate',
  })
  @IsString()
  endDate: string;

  @ApiProperty({
    required: true,
    type: IsNumber,
    description: 'vendorId',
  })
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
  })
  @Type(() => Number)
  vendorId: number;
}
