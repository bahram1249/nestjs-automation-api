import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [LoginModule, RoleModule],
})
export class CoreDashboardModule {}
