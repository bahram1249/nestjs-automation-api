import { Module } from '@nestjs/common';
import { AuthModule } from '../../api/core/auth/auth.module';
import { UserModule } from '../../api/core/admin/user/user.module';
import { RoleModule } from '../../api/core/admin/role/role.module';
import { PermissionModule } from '../../api/core/admin/permission/permission.module';

@Module({
  imports: [AuthModule, UserModule, RoleModule, PermissionModule],
})
export class CoreRouteModule {}
