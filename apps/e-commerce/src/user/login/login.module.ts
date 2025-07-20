import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { RedisClientModule } from '@rahino/redis-client';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { AuthService } from '@rahino/core/auth/auth.service';
import { JwtStrategy } from '@rahino/auth';
import { JwtModule } from '@nestjs/jwt';
import { Menu } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { PermissionMenu } from '@rahino/database';
import { ECommerceSmsModule } from '@rahino/ecommerce/shared/sms/ecommerce-sms.module';
import { ECWallet } from '@rahino/localdatabase/models';

@Module({
  imports: [
    JwtModule.register({}),
    RedisClientModule,
    SequelizeModule.forFeature([
      User,
      ECWallet,
      Menu,
      RolePermission,
      PermissionMenu,
    ]),
    ECommerceSmsModule,
  ],
  controllers: [LoginController],
  providers: [AuthService, JwtStrategy, LoginService],
})
export class LoginModule {}
