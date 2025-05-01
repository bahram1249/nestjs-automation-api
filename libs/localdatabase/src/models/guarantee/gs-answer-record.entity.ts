import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { GSResponse } from './gs-response.entity';
import { GSQuestion } from './gs-question.entity';
import { GSAnswerOption } from './gs-answer-option.entity';

@Table({ tableName: 'GSAnswerRecords' })
export class GSAnswerRecord extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSResponse)
  responseId: bigint;

  @BelongsTo(() => GSResponse, { as: 'response', foreignKey: 'responseId' })
  response?: GSResponse;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSQuestion)
  questionId: bigint;

  @BelongsTo(() => GSQuestion, { as: 'question', foreignKey: 'questionId' })
  question?: GSQuestion;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSAnswerOption)
  answerOptionId: bigint;

  @BelongsTo(() => GSAnswerOption, {
    as: 'answerOption',
    foreignKey: 'answerOptionId',
  })
  answerOption?: GSAnswerOption;

  @Column({
    type: DataType.DECIMAL(5, 2),
  })
  weight: number;
}
