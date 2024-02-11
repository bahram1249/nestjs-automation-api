import { Module } from '@nestjs/common';
import { LoginModule } from './login/login.module';
import { AdminModule } from './admin/admin.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [LoginModule, AdminModule, UserModule],
})
export class CoreDashboardModule {}
