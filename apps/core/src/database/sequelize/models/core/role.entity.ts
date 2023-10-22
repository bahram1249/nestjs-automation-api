import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserRole } from './userRole.entity';
import { RolePermission } from './rolePermission.entity';

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

  @HasMany(() => UserRole)
  userRoles: UserRole[];

  @HasMany(() => RolePermission)
  rolePermissions: RolePermission[];
}
