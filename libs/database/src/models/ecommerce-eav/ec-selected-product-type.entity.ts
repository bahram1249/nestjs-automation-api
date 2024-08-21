import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECSelectedProductTypes' })
export class ECSelectedProductType extends Model {
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
