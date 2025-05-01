import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSQuestion } from './gs-question.entity';

@Table({ tableName: 'GSAnswerOptions' })
export class GSAnswerOption extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSQuestion)
  questionId: bigint;

  @BelongsTo(() => GSQuestion, { as: 'question', foreignKey: 'questionId' })
  question?: GSQuestion;

  @Column({
    type: DataType.STRING,
  })
  title: string;
  @Column({
    type: DataType.DECIMAL(5, 2),
  })
  weight: number;
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;
}
