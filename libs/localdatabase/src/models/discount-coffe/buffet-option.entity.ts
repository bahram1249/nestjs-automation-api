import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Buffet } from './buffet.entity';
import { CoffeOption } from './coffe-option.entity';

@Table({ tableName: 'DiscountCoffeBuffetOptions' })
export class BuffetOption extends Model {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
    autoIncrement: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => Buffet)
  buffetId: bigint;
  @BelongsTo(() => Buffet, { as: 'buffet', foreignKey: 'buffetId' })
  buffet?: Buffet;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => CoffeOption)
  optionId: number;
  @BelongsTo(() => CoffeOption, { as: 'coffeOption', foreignKey: 'optionId' })
  coffeOption?: CoffeOption;
}
