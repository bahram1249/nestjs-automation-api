import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSServiceTypes' })
export class GSServiceType extends Model {
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
