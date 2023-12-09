import { Module } from '@nestjs/common';
import { RoleModule } from './role/role.module';
import { LoginModule } from './login/login.module';

import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
@Module({
  imports: [SequelizeModule.forFeature([User]), LoginModule, RoleModule],
})
export class CoreDashboardModule {}
