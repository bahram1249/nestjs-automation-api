import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Buffet } from './buffet.entity';

@Table({ tableName: 'DiscountCoffeIgnoreReserves' })
export class BuffetIgnoreReserve extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(()=> Buffet)
  buffetId: bigint;

  @BelongsTo(()=> Buffet, {as:"buffet", foreignKey: "buffetId"})
  buffet?: Buffet;

  @Column({
    type: DataType.DATE,
  })
  ignoreDate: Date;
}
