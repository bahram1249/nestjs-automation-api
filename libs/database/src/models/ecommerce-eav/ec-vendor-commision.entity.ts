import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECVendor } from './ec-vendor.entity';
import { ECVariationPrice } from './ec-variation-prices';
import { ECVendorCommissionType } from './ec-vendor-commission-type.entity';

@Table({ tableName: 'ECVendorCommissions' })
export class ECVendorCommission extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECVendor)
  vendorId: number;
  @BelongsTo(() => ECVendor, { as: 'vendor', foreignKey: 'vendorId' })
  vendor?: ECVendor;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECVariationPrice)
  variationPriceId: number;
  @BelongsTo(() => ECVariationPrice, {
    as: 'variationPrice',
    foreignKey: 'variationPriceId',
  })
  variationPrice?: ECVariationPrice;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECVendorCommissionType)
  commissionTypeId: number;

  @BelongsTo(() => ECVendorCommissionType, {
    as: 'commissionType',
    foreignKey: 'commissionTypeId',
  })
  commissionType?: ECVendorCommissionType;

  @Column({
    type: DataType.BIGINT,
  })
  amount: bigint;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
