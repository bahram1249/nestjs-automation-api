import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { UserRole } from './userRole.entity';
import { RolePermission } from './rolePermission.entity';
import { Permission } from './permission.entity';

@Table
export class Role extends Model {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  roleName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  static_id: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  visibility?: boolean;

  @HasMany(() => UserRole)
  userRoles: UserRole[];

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];
  @BelongsToMany(() => Permission, () => RolePermission)
  permissions: Permission[];
}
