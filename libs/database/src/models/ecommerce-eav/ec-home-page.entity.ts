import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../core/user.entity';

@Table({ tableName: 'ECHomePages' })
export class ECHomePage extends Model {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: bigint;

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
    primaryKey: true,
  })
  isDeleted: boolean;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  priority?: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  jsonContent?: string;
}
