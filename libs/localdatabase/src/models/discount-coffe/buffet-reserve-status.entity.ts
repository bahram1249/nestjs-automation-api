import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'DiscountCoffeReserveStatuses' })
export class BuffetReserveStatus extends Model {
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
