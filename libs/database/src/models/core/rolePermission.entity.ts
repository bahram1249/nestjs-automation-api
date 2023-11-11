import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { Permission } from './permission.entity';

@Table
export class RolePermission extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({})
  @ForeignKey(() => Role)
  roleId: number;

  @BelongsTo(() => Role, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  role: Role;

  @Column({})
  @ForeignKey(() => Permission)
  permissionId: number;

  @BelongsTo(() => Permission, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  permission: Permission;
}
