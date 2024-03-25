import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { ECUserSession } from './ec-user-session.entity';
import { ECProduct } from './ec-product.entity';
import { ECInventory } from './ec-inventory.entity';
import { AutoMap } from 'automapper-classes';

@Table({ tableName: 'ECStocks' })
export class ECStock extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  @ForeignKey(() => ECUserSession)
  sessionId: string;
  @BelongsTo(() => ECUserSession, { as: 'session', foreignKey: 'sessionId' })
  session?: ECUserSession;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECProduct)
  productId: bigint;

  @Column({ type: DataType.VIRTUAL, allowNull: true })
  product?: ECProduct;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => ECInventory)
  inventoryId: bigint;

  @BelongsTo(() => ECInventory, { as: 'inventory', foreignKey: 'inventoryId' })
  inventory?: ECInventory;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  qty: number;

  @Column({
    type: DataType.DATE,
  })
  expire: Date;

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
}
