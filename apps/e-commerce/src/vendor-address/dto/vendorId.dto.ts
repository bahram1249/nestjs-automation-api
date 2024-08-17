import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { Type } from 'class-transformer';
import { IsInt, IsNumber } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class VendorIdDto {
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
  })
  @Type(() => Number)
  @ApiProperty({
    minimum: 1,
    required: false,
    type: IsNumber,
    description: 'vendorId',
  })
  vendorId?: number;
}
