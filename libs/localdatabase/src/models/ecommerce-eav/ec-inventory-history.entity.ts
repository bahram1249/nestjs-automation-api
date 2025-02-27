import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECInventory } from './ec-inventory.entity';
import { ECProduct } from './ec-product.entity';
import { ECInventoryTrackChangeStatus } from './ec-inventory-track-change-status.entity';
import { ECOrder } from './ec-order.entity';

@Table({ tableName: 'ECInventoryHistories' })
export class ECInventoryHistory extends Model {
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
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECProduct)
  productId: bigint;

  @BelongsTo(() => ECProduct, { as: 'product', foreignKey: 'productId' })
  product?: ECProduct;

  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => ECInventoryTrackChangeStatus)
  inventoryTrackChangeStatusId: number;

  @BelongsTo(() => ECInventoryTrackChangeStatus, {
    as: 'inventoryTrackStatus',
    foreignKey: 'inventoryTrackChangeStatusId',
  })
  inventoryTrackStatus?: ECInventoryTrackChangeStatus;

  @Column({
    type: DataType.INTEGER,
  })
  qty: number;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => ECOrder)
  orderId?: bigint;

  @BelongsTo(() => ECOrder, { as: 'order', foreignKey: 'orderId' })
  order?: ECOrder;
}
