import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECShoppingCart } from './ec-shopping-cart.entity';
import { ECProduct } from './ec-product.entity';
import { ECInventory } from './ec-inventory.entity';

@Table({ tableName: 'ECShoppingCartProducts' })
export class ECShoppingCartProduct extends Model<ECShoppingCartProduct> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECShoppingCart)
  shoppingCartId: bigint;

  @BelongsTo(() => ECShoppingCart, {
    as: 'shoppingCart',
    foreignKey: 'shoppingCartId',
  })
  shoppingCart?: ECShoppingCart;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECProduct)
  productId: bigint;

  @BelongsTo(() => ECProduct, {
    as: 'product',
    foreignKey: 'productId',
  })
  product?: ECProduct;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECInventory)
  inventoryId: bigint;

  @BelongsTo(() => ECInventory, { as: 'inventory', foreignKey: 'inventoryId' })
  inventory?: ECInventory;

  @Column({
    type: DataType.INTEGER,
  })
  qty: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
