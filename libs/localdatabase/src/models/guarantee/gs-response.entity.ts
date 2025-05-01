import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { GSRequest } from './gs-request.entity';
import { User } from '@rahino/database';
import { GSAnswerRecord } from './gs-answer-record.entity';

@Table({ tableName: 'GSResponses' })
export class GSResponse extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;
  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => GSRequest)
  requestId: bigint;

  @BelongsTo(() => GSRequest, { as: 'request', foreignKey: 'requestId' })
  request?: GSRequest;

  @Column({
    type: DataType.BIGINT,
  })
  @ForeignKey(() => User)
  userId: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.DECIMAL(10, 2),
  })
  fromScore: number;
  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: true,
  })
  totalScore?: number;

  @HasMany(() => GSAnswerRecord)
  answerRecords: GSAnswerRecord[];
}
