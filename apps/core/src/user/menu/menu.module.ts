import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { MenuService } from './menu.service';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { PermissionMenu } from '@rahino/database/models/core/permission-menu.entity';
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
