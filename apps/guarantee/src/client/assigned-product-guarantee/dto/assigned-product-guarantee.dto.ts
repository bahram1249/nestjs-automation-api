import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class AssignedProductGuaranteeDto {
  @AutoMap()
  @IsNumber()
  guaranteeId: number;

  @AutoMap()
  @IsNumber()
  variantId: number;

  @AutoMap()
  @IsNumber()
  productTypeId: number;

  @AutoMap()
  @IsNumber()
  brandId: number;
}
