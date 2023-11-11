import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity';
import { Role } from './role.entity';

@Table
export class UserRole extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({})
  @ForeignKey(() => User)
  userId: bigint;
  @BelongsTo(() => User, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  user: User;

  @Column({})
  @ForeignKey(() => Role)
  roleId: number;
  @BelongsTo(() => Role, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  role: Role;
}
