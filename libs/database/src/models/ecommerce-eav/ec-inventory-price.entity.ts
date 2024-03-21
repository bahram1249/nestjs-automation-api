import {
  Table,
  Model,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { User } from '@rahino/database/models/core/user.entity';
import { DiscountAppliedInterface } from '@rahino/ecommerce/admin/discount/interface/discount-applied.interface';

@Table({ tableName: 'ECInventoryPrices' })
export class ECInventoryPrice extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

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
  @ForeignKey(() => ECVariationPrice)
  variationPriceId: number;

  @BelongsTo(() => ECVariationPrice, {
    as: 'variationPrice',
    foreignKey: 'variationPriceId',
  })
  variationPrice?: ECVariationPrice;

  @Column({
    type: DataType.BIGINT,
  })
  price: bigint;

  @Column({
    type: DataType.BIGINT,
  })
  buyPrice?: bigint;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  deletedBy?: bigint;

  @BelongsTo(() => User, { as: 'deletedByUser', foreignKey: 'deletedBy' })
  deletedByUser?: User;

  @Column({
    type: DataType.VIRTUAL,
    allowNull: true,
  })
  appliedDiscount?: DiscountAppliedInterface;
}
