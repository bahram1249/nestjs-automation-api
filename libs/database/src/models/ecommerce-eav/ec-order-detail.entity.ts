import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECOrder } from './ec-order.entity';
import { ECOrderDetailStatus } from './ec-order-detail-status.entity';
import { ECVendor } from './ec-vendor.entity';
import { ECProduct } from './ec-product.entity';
import { ECInventory } from './ec-inventory.entity';
import { ECInventoryPrice } from './ec-inventory-price.entity';
import { ECStock } from './ec-stocks.entity';
import { ECDiscount } from './ec-discount.entity';
import { User } from '../core/user.entity';
import { ECVendorCommission } from './ec-vendor-commision.entity';

@Table({ tableName: 'ECOrderDetails' })
export class ECOrderDetail extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECOrder)
  orderId: bigint;

  @BelongsTo(() => ECOrder, { as: 'order', foreignKey: 'orderId' })
  order?: ECOrder;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECOrderDetailStatus)
  orderDetailStatusId: number;

  @BelongsTo(() => ECOrderDetailStatus, {
    as: 'orderDetailStatus',
    foreignKey: 'orderDetailStatusId',
  })
  orderDetailStatus?: ECOrderDetailStatus;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECVendor)
  vendorId: number;

  @BelongsTo(() => ECVendor, { as: 'vendor', foreignKey: 'vendorId' })
  vendor?: ECVendor;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECProduct)
  productId: bigint;

  @BelongsTo(() => ECProduct, { as: 'product', foreignKey: 'productId' })
  product?: ECProduct;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECInventory)
  inventoryId: bigint;

  @BelongsTo(() => ECInventory, { as: 'inventory', foreignKey: 'inventoryId' })
  inventory?: ECInventory;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECInventoryPrice)
  inventoryPriceId: bigint;

  @BelongsTo(() => ECInventoryPrice, {
    as: 'inventoryPrice',
    foreignKey: 'inventoryPriceId',
  })
  inventoryPrice?: ECInventoryPrice;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECStock)
  stockId?: bigint;

  @BelongsTo(() => ECStock, { as: 'stock', foreignKey: 'stockId' })
  stock?: ECStock;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  qty?: number;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  productPrice?: bigint;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  discountFee?: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  discountFeePerItem?: bigint;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECDiscount)
  discountId?: bigint;

  @BelongsTo(() => ECDiscount, { as: 'discount', foreignKey: 'discountId' })
  discount?: ECDiscount;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  totalPrice?: bigint;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  userId?: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECVendorCommission)
  vendorCommissionId?: bigint;
  @BelongsTo(() => ECVendorCommission, {
    as: 'vendorCommission',
    foreignKey: 'vendorCommissionId',
  })
  vendorCommission?: ECVendorCommission;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  commissionAmount?: bigint;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  gregorianAtPersian?: string;
}
