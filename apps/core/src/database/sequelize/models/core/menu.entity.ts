import {
  Table,
  Column,
  Model,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { PermissionMenu } from './permission-menu.entity';

@Table({})
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
  order?: number;
  @ForeignKey(() => Menu)
  @Column({ onDelete: 'NO ACTION', onUpdate: 'NO ACTION', allowNull: true })
  parentMenuId?: number;
  @HasMany(() => Menu, {
    foreignKey: 'parentMenuId',
    as: 'subMenus',
  })
  subMenus?: Menu[];

  @Column({})
  visibility?: boolean;

  @HasMany(() => PermissionMenu)
  permissionMenus?: PermissionMenu[];
}
