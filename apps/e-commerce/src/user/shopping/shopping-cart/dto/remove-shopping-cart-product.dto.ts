import { IsNumber } from 'class-validator';

import { AutoMap } from 'automapper-classes';

export class RemoveShoppingCartProductDto {
  @AutoMap()
  @IsNumber()
  shoppingCartProductId: bigint;
}
