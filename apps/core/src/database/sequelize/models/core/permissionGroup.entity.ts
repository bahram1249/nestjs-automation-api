import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { Permission } from './permission.entity';

@Table
export class PermissionGroup extends Model {
  static associate(models) {
    PermissionGroup.hasMany(models.Permission, {
      as: 'permissions',
      foreignKey: 'permissionGroupId',
    });
  }

  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({})
  permissionGroupName: string;
  @Column({})
  visiblity?: boolean;
  order?: number;
  @HasMany(() => Permission, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  permissions: Permission[];
}
