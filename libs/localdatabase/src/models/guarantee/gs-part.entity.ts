import { AutoMap } from 'automapper-classes';
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSUnitPrice } from './gs-unit-price.entity';

@Table({ tableName: 'GSParts' })
export class GSPart extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.BIGINT,
  })
  minFee: bigint;
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice, { as: 'unitPrice', foreignKey: 'unitPriceId' })
  unitPrice?: GSUnitPrice;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  dollarBaseFee?: number;
}
