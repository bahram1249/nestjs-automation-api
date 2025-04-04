import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSShippingWays' })
export class GSShippingWay extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.STRING,
  })
  icon: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isClientSide?: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isCartableSide?: boolean;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
