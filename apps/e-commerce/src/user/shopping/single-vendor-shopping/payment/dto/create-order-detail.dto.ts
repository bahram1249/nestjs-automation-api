import { ECOrder } from '@rahino/localdatabase/models';
import { Transaction } from 'sequelize';
import { FormatShoppingCartProductOutputDto } from '../../shopping-cart/dto';
import { User } from '@rahino/database';

export class SingleVendorShoppingCreateOrderDetailDto {
  order: ECOrder;
  products: FormatShoppingCartProductOutputDto[];
  user: User;
  transaction?: Transaction;
}
