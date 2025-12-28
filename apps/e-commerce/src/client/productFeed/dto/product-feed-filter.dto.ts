import { ApiProperty } from '@nestjs/swagger';
import { SortOrder } from '@rahino/query-filter';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Max } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class ProductFeedFilter {
  @Transform(({ value }) => Math.max(Number(value), 0))
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 0,
    required: false,
    default: 0,
    type: IsNumber,
    description: 'page',
  })
  public page? = 0;

  @Max(100, {
    message: i18nValidationMessage<I18nTranslations>('validation.MAX'),
  })
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    minimum: 1,
    maximum: 100,
    required: false,
    default: 10,
    description: 'how many item returned.',
    type: IsNumber,
  })
  public size? = 100;

  @IsOptional()
  @ApiProperty({
    default: 'id',
    required: false,
    type: IsString,
    description: 'orderBy field',
  })
  public orderBy?: string = 'id';

  @IsEnum(SortOrder)
  @IsOptional()
  @ApiProperty({
    type: IsString,
    enum: SortOrder,
    default: SortOrder.DESC,
    description: 'sort order',
    required: false,
  })
  public sortOrder?: SortOrder = SortOrder.DESC;

  @IsOptional()
  @ApiProperty({ required: false, type: IsString, default: '' })
  @Transform(({ value }) => '%' + value + '%')
  public search?: string = '%%';
}
