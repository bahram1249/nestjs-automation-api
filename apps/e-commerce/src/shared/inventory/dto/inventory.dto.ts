import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { AutoMap } from 'automapper-classes';
import { InventoryPriceDto } from './inventory-price.dto';

export class InventoryDto {
  @IsOptional()
  @IsNumber()
  id?: bigint;

  @AutoMap()
  @IsNumber()
  vendorId: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  colorId?: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  guaranteeId?: number;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  guaranteeMonthId?: number;

  @AutoMap()
  @IsNumber()
  @IsOptional()
  buyPrice: bigint;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  onlyProvinceId?: number;

  @AutoMap()
  @IsNumber()
  qty: number;

  @AutoMap()
  @IsNumber()
  vendorAddressId: bigint;

  @AutoMap()
  @IsOptional()
  @IsNumber()
  weight?: number;

  @AutoMap()
  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  firstPrice?: bigint;

  @IsOptional()
  @IsNumber()
  secondaryPrice?: bigint;

  @IsOptional()
  @IsArray()
  inventoryPrices?: InventoryPriceDto[] = [];

  @IsOptional()
  @IsString()
  @AutoMap()
  inventoryDescriptor?: string;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  scheduleSendingTypeId?: number;

  @IsOptional()
  @IsNumber()
  @AutoMap()
  offsetDay?: number;
}
