import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'ECPublishStatuses' })
export class ECPublishStatus extends Model {
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
