import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class StockPriceDto {
  @IsOptional()
  @ApiProperty({
    required: false,
    type: Number,
    description: 'addressId',
  })
  @IsNumber(
    {},
    {
      message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
    },
  )
  addressId?: bigint;

  @IsOptional()
  @IsString({
    message: i18nValidationMessage<I18nTranslations>('validation.STRING'),
  })
  @ApiProperty({
    required: false,
    description: 'couponCode',
  })
  couponCode?: string;
}
