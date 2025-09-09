import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class ProductInventoryPairDto {
  @AutoMap()
  @IsNumber()
  productId: number;

  @AutoMap()
  @IsNumber()
  inventoryId: number;
}
