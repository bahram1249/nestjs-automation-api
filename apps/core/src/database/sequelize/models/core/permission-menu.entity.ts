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

  @Column({})
  @ForeignKey(() => Permission)
  permissionId: number;
  @BelongsTo(() => Permission, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  permission: Permission;
  @Column({})
  @ForeignKey(() => Menu)
  menuId: number;
  @BelongsTo(() => Menu, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  menu: Menu;
}
