import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class InventoryDto {
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

  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'inventoryStatusId',
  })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
  })
  @Type(() => Number)
  inventoryStatusId?: number;

  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'minQty',
  })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
  })
  @Type(() => Number)
  minQty?: number;

  @ApiProperty({
    required: false,
    type: IsNumber,
    description: 'maxQty',
  })
  @IsOptional()
  @IsInt({
    message: i18nValidationMessage<I18nTranslations>('validation.NUMBER'),
  })
  @Type(() => Number)
  maxQty?: number;
}
