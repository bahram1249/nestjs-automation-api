import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'DiscountCoffeOptions' })
export class CoffeOption extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: false,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.STRING,
  })
  iconClass: string;
}
