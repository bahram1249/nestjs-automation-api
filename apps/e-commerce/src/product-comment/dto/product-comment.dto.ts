import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { UserEntityTypeFactorDto } from './entity-type-factor.dto';

export class ProductCommentDto {
  @MinLength(3, {
    message: i18nValidationMessage<I18nTranslations>('validation.MIN'),
  })
  @MaxLength(1024, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @IsNotEmpty({
    message: i18nValidationMessage<I18nTranslations>('validation.NOT_EMPTY'),
  })
  @AutoMap()
  description: string;

  @AutoMap()
  @IsNumber(
    {},
    { message: i18nValidationMessage<I18nTranslations>('validation.NUMBER') },
  )
  productId: bigint;

  @IsArray()
  @IsOptional()
  entityTypeFactors?: UserEntityTypeFactorDto[];
}
