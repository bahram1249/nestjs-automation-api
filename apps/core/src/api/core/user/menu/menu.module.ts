import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
import { MenuService } from './menu.service';
import { Menu } from 'apps/core/src/database/sequelize/models/core/menu.entity';
import { UserRole } from 'apps/core/src/database/sequelize/models/core/userRole.entity';
import { RolePermission } from 'apps/core/src/database/sequelize/models/core/rolePermission.entity';
import { PermissionMenu } from 'apps/core/src/database/sequelize/models/core/permission-menu.entity';
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
