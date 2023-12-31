import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { BuffetMenu } from './buffet-menu.entity';
import { BuffetReserve } from './buffet-reserve.entity';

@Table({ tableName: 'DiscountCoffeReserveDetails' })
export class BuffetReserveDetail extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => BuffetReserve)
  reserveId: bigint;
  @BelongsTo(() => BuffetReserve, {
    as: 'buffetReserve',
    foreignKey: 'reserveId',
  })
  buffetReserve?: BuffetReserve;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => BuffetMenu)
  menuId: bigint;
  @BelongsTo(() => BuffetMenu, { as: 'buffetMenu', foreignKey: 'menuId' })
  buffetMenu?: BuffetMenu;
  @Column({
    type: DataType.BIGINT,
  })
  price: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  totalPrice: bigint;
  @Column({
    type: DataType.INTEGER,
  })
  countItem: number;
}
