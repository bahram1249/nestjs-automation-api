import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECShippingWays' })
export class ECShippingWay extends Model<ECShippingWay> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
}
