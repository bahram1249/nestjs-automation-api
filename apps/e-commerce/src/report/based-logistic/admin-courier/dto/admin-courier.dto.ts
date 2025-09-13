import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class AdminLogisticCourierDto {
  @ApiProperty({ required: true, type: String, description: 'beginDate' })
  @IsString()
  beginDate: string;

  @ApiProperty({ required: true, type: String, description: 'endDate' })
  @IsString()
  endDate: string;

  @ApiProperty({ required: false, type: Number, description: 'courierId' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') })
  @Type(() => Number)
  courierId?: number;

  @ApiProperty({ required: false, type: Number, description: 'orderId' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') })
  @Type(() => Number)
  orderId?: bigint;

  @ApiProperty({ required: false, type: Number, description: 'logisticId' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') })
  @Type(() => Number)
  logisticId?: number;

  @ApiProperty({ required: false, type: Number, description: 'vendorId' })
  @IsOptional()
  @IsInt({ message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') })
  @Type(() => Number)
  vendorId?: number;
}
