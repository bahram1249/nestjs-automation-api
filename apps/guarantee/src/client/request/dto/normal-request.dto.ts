import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { AttachmentDto } from './attachment.dto';

export class NormalRequestDto {
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
  guaranteeId: bigint;

  @IsArray()
  attachments: AttachmentDto[] = [];
}
