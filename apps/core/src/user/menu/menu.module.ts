import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { MenuService } from './menu.service';
import { Menu } from '@rahino/database';
import { UserRole } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { PermissionMenu } from '@rahino/database';
import { MenuController } from './menu.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      Menu,
      UserRole,
      RolePermission,
      PermissionMenu,
    ]),
  ],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
