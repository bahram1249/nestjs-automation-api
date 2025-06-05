import { AutoMap } from 'automapper-classes';
import { IsNumber } from 'class-validator';

export class AddProductShoppingCartDto {
  @AutoMap()
  @IsNumber()
  inventoryId: bigint;
  @AutoMap()
  @IsNumber()
  qty: number;
}
