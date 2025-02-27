import { Table, Column, Model, DataType } from 'sequelize-typescript';
@Table({ tableName: 'ECProductCommentStatuses' })
export class ECProductCommentStatus extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  name: string;
}
