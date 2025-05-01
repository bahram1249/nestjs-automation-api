import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSQuestions' })
export class GSQuestion extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;
  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: true,
  })
  maxWeight?: number;
}
