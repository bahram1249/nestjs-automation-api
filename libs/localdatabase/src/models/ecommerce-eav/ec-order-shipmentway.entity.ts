import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECOrderShipmentWays' })
export class ECOrderShipmentWay extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isPeriodic?: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon: string;
}
