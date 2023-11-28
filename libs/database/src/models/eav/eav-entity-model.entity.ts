import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'EAVEntityModels' })
export class EAVEntityModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: false,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;
}
