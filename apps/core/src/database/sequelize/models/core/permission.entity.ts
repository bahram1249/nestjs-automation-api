import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
  DataType,
} from 'sequelize-typescript';
import { PermissionGroup } from './permissionGroup.entity';
import { RolePermission } from './rolePermission.entity';

@Table
export class Permission extends Model {
  static associate(models) {
    // Permission.belongsTo(models.PermissionGroup, {
    //   as: 'permissionGroup',
    //   foreignKey: 'permissionGroupId',
    // });
    // Permission.hasMany(models.RolePermission, {
    //   as: 'rolePermissions',
    //   foreignKey: 'permissionId',
    // });
  }

  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    allowNull: true,
  })
  permissionSymbol?: string;

  @Column({
    allowNull: true,
  })
  permissionName: string;
  @Column({
    allowNull: true,
    type: DataType.STRING(1024),
  })
  permissionUrl: string;
  @Column({
    allowNull: true,
    type: DataType.STRING(10),
  })
  permissionMethod: string;
  @Column({ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @ForeignKey(() => PermissionGroup)
  permissionGroupId?: number;
  @BelongsTo(() => PermissionGroup)
  permissionGroup?: PermissionGroup;
  // @Column({})
  // menuId: number;
  @Column({})
  visibility?: boolean;
  @HasMany(() => RolePermission)
  rolePermissions?: RolePermission[];
}
