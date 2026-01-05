import { AutoMap } from 'automapper-classes';
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class VipBundleDto {
  @AutoMap()
  @IsNumber()
  vipBundleTypeId: number;

  @AutoMap()
  @IsString()
  @IsOptional()
  discountCode?: string;
}
