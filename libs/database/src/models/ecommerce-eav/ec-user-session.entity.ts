import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../core/user.entity';

@Table({ tableName: 'ECUserSessions' })
export class ECUserSession extends Model {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  @ForeignKey(() => User)
  userId?: bigint;

  @BelongsTo(() => User, { as: 'user', foreignKey: 'userId' })
  user?: User;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isDeleted?: boolean;
  @Column({
    type: DataType.DATE,
  })
  expireAt: Date;
}
