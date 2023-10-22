import { Module } from '@nestjs/common';
import { AuthModule } from '../../api/core/auth/auth.module';
import { UserModule } from '../../api/core/admin/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
})
export class CoreRouteModule {}
