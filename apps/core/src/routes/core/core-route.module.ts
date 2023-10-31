import { Module } from '@nestjs/common';
import { AuthModule } from '../../api/core/auth/auth.module';
import { UserModule } from '../../api/core/admin/user/user.module';
import { RoleModule } from '../../api/core/admin/role/role.module';
import { RoleModule as UserRoleModule } from '../../api/core/user/role/role.module';
import { PermissionModule } from '../../api/core/admin/permission/permission.module';
import { MenuModule } from '../../api/core/admin/menu/menu.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../../database/sequelize/models/core/user.entity';
import { Permission } from '../../database/sequelize/models/core/permission.entity';
import { PermissionGroupModule } from '../../api/core/admin/permission-group/permission-group.module';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission]),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    MenuModule,
    PermissionGroupModule,
    UserRoleModule,
  ],
})
export class CoreRouteModule {}
