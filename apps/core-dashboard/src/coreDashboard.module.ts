import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { LoginModule } from './login/login.module';

import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { UserModule } from './user/user.module';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    LoginModule,
    RoleModule,
    UserModule,
  ],
})
export class CoreDashboardModule {}
