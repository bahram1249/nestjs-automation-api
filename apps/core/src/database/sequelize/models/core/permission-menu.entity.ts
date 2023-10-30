import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Permission } from './permission.entity';
import { Menu } from './menu.entity';

@Table
export class PermissionMenu extends Model {
  static associate(models) {
    // PermissionMenu.belongsTo(models.Menu, {
    //   as: 'menu',
    //   foreignKey: 'menuId',
    // });
    // PermissionMenu.hasMany(models.Permission, {
    //   as: 'permission',
    //   foreignKey: 'permissionId',
    // });
  }

  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @ForeignKey(() => Permission)
  permissionId: number;
  @BelongsTo(() => Permission)
  permission: Permission;
  @Column({ onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @ForeignKey(() => Menu)
  menuId: number;
  @BelongsTo(() => Menu)
  menu: Menu;
}
