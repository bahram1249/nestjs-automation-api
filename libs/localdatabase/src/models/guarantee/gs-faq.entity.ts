import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSFaqs' })
export class GSFaq extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  id: number;
  @Column({
    type: DataType.STRING,
  })
  question: string;

  @Column({
    type: DataType.STRING,
  })
  answer: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
}
