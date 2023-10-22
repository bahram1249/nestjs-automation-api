import { Module } from '@nestjs/common';
import { AuthModule } from '../../api/core/auth/auth.module';
import { UserModule } from '../../api/core/admin/user/user.module';
import { RoleModule } from '../../api/core/admin/role/role.module';

@Module({
  imports: [AuthModule, UserModule, RoleModule],
})
export class CoreRouteModule {}
