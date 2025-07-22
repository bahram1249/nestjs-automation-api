import { ApiProperty } from '@nestjs/swagger';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ProfileDto {
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @IsString()
  @AutoMap()
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'firstname',
  })
  firstname: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @IsString()
  @AutoMap()
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'lastname',
  })
  lastname: string;

  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @IsString()
  @Matches(new RegExp('^([0-9]){10}$'))
  @ApiProperty({
    required: true,
    type: IsString,
    default: 'string',
    description: 'nationalCode',
  })
  @AutoMap()
  nationalCode: string;
}
