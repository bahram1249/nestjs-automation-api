import { AutoMap } from 'automapper-classes';
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'GSFaqs' })
export class GSFaq extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  question: string;

  @AutoMap()
  @Column({
    type: DataType.STRING,
  })
  answer: string;

  @AutoMap()
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
