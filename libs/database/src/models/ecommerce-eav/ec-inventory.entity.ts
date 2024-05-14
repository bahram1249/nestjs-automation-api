import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasOne,
} from 'sequelize-typescript';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECVendorAddress } from '@rahino/database/models/ecommerce-eav/ec-vendor-address.entity';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { AutoMap } from 'automapper-classes';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { Op, Sequelize } from 'sequelize';

@Table({ tableName: 'ECInventories' })
export class ECInventory extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECProduct)
  productId: bigint;

  @BelongsTo(() => ECProduct, { as: 'product', foreignKey: 'productId' })
  product?: ECProduct;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECVendor)
  vendorId: number;

  @BelongsTo(() => ECVendor, { as: 'vendor', foreignKey: 'vendorId' })
  vendor?: ECVendor;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECColor)
  colorId?: number;

  @BelongsTo(() => ECColor, { as: 'color', foreignKey: 'colorId' })
  color?: ECColor;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECGuarantee)
  guaranteeId?: number;

  @BelongsTo(() => ECGuarantee, { as: 'guarantee', foreignKey: 'guaranteeId' })
  guarantee?: ECGuarantee;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECGuaranteeMonth)
  guaranteeMonthId?: number;

  @BelongsTo(() => ECGuaranteeMonth, {
    as: 'guaranteeMonth',
    foreignKey: 'guaranteeMonthId',
  })
  guaranteeMonth?: ECGuaranteeMonth;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  buyPrice?: bigint;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  qty: number;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  @ForeignKey(() => ECProvince)
  onlyProvinceId?: number;

  @BelongsTo(() => ECProvince, {
    as: 'onlyProvince',
    foreignKey: 'onlyProvinceId',
  })
  onlyProvince?: ECProvince;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECVendorAddress)
  vendorAddressId: bigint;

  @BelongsTo(() => ECVendorAddress, {
    as: 'vendorAddress',
    foreignKey: 'vendorAddressId',
  })
  vendorAddress?: ECVendorAddress;

  @AutoMap()
  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  weight?: number;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECInventoryStatus)
  inventoryStatusId: number;

  @BelongsTo(() => ECInventoryStatus, {
    as: 'inventoryStatus',
    foreignKey: 'inventoryStatusId',
  })
  inventoryStatus?: ECInventoryStatus;

  @AutoMap()
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

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
  @ForeignKey(() => User)
  deletedBy?: bigint;

  @BelongsTo(() => User, { as: 'deletedByUser', foreignKey: 'deletedBy' })
  deletedByUser?: User;

  @HasOne(() => ECInventoryPrice, {
    as: 'firstPrice',
    foreignKey: 'inventoryId',
    scope: {
      [Op.and]: [
        {
          variationPriceId: 1,
        },
      ],
    },
  })
  firstPrice?: ECInventoryPrice;

  @HasOne(() => ECInventoryPrice, {
    as: 'secondaryPrice',
    foreignKey: 'inventoryId',
    scope: {
      [Op.and]: [
        {
          variationPriceId: 2,
        },
      ],
    },
  })
  secondaryPrice?: ECInventoryPrice;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  discountTypeId?: number;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  discountStartDate?: Date;
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  discountEndDate?: Date;
}
