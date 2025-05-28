import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { ECVendor } from './ec-vendor.entity';
import { ECShippingWay } from './ec-shippingway.entity';
import { ECShoppingCartProduct } from './ec-shopping-cart-product.entity';

@Table({ tableName: 'ECShoppingCarts' })
export class ECShoppingCart extends Model<ECShoppingCart> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  sessionId: string;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  expire?: Date;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isPurchase?: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECVendor)
  vendorId?: number;

  @BelongsTo(() => ECVendor, { as: 'vendor', foreignKey: 'vendorId' })
  vendor?: ECVendor;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECShippingWay)
  shippingWayId: number;

  @BelongsTo(() => ECShippingWay, {
    as: 'shippingWay',
    foreignKey: 'shippingWayId',
  })
  shippingWay?: ECShippingWay;

  @HasMany(() => ECShoppingCartProduct, {
    as: 'shoppingCartProducts',
    foreignKey: 'shoppingCartId',
  })
  shoppingCartProducts?: ECShoppingCartProduct[];
}
