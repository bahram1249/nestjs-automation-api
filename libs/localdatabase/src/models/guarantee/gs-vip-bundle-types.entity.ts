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

@Table({ tableName: 'GSVipBundleTypes' })
export class GSVipBundleType extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  title: string;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  monthPeriod: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  cardColor: string;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  price: bigint;

  @AutoMap()
  @Column({
    type: DataType.BIGINT,
  })
  fee: bigint;

  @AutoMap()
  @Column({
    type: DataType.INTEGER,
  })
  @ForeignKey(() => GSUnitPrice)
  unitPriceId: number;

  @BelongsTo(() => GSUnitPrice, { as: 'unitPrice', foreignKey: 'unitPriceId' })
  unitPrice: GSUnitPrice;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
