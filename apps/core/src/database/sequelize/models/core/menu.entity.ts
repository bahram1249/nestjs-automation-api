import {
  Table,
  Column,
  Model,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Permission } from './permission.entity';
import { PermissionMenu } from './permission-menu.entity';

@Table
export class Menu extends Model {
  static associate(models) {
    // Menu.hasMany(models.Menu, { as: 'subMenus', foreignKey: 'subMenuId' });
    // Menu.hasMany(models.Permission, {
    //   as: 'permissions',
    //   foreignKey: 'menuId',
    // });
  }

  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({})
  title: string;
  @Column({})
  url: string;
  @Column({})
  icon: string;
  @Column({})
  className: string;
  @Column({})
  @ForeignKey(() => Menu)
  subMenuId: number;
  @HasMany(() => Menu, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  subMenus: Menu[];

  @HasMany(() => PermissionMenu, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  permissionMenus: PermissionMenu[];
}
