import { IsNumber } from 'class-validator';

import { AutoMap } from 'automapper-classes';

export class RemoveShoppingCartDto {
  @AutoMap()
  @IsNumber()
  shoppingCartId: bigint;
}
