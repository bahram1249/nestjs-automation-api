import { Type } from 'class-transformer';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { ProductInventoryPairDto } from './product-inventory-pair.dto';

export class ProductInventoryPairsFilterDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductInventoryPairDto)
  productInventoryPairs?: ProductInventoryPairDto[];
}
