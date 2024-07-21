import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECEntityTypeSorts' })
export class ECEntityTypeSort extends Model {
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
  sortField: string;
  @Column({
    type: DataType.STRING,
  })
  sortOrder: string;
}
