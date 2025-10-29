import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachmentDto } from './attachment.dto';
import { RequestItemDto } from './request-item.dto';

export class OutOfWarrantyRequestDto {
  @IsOptional()
  @IsString()
  @AutoMap()
  description: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @IsString()
  @Matches(new RegExp('^([0-9]){4}([0-9]){7,8}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'phoneNumber',
  })
  @AutoMap()
  phoneNumber: string;

  @AutoMap()
  @IsNumber()
  requestTypeId: number;

  @AutoMap()
  @IsNumber()
  addressId: bigint;

  @AutoMap()
  @IsNumber()
  variantId: number;

  @AutoMap()
  @IsNumber()
  productTypeId: number;

  @AutoMap()
  @IsNumber()
  brandId: number;

  @IsArray()
  attachments: AttachmentDto[] = [];

  @IsOptional()
  @IsArray()
  items?: RequestItemDto[] = [];
}
