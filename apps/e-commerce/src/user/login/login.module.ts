import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { RedisClientModule } from '@rahino/redis-client';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { AuthService } from '@rahino/core/auth/auth.service';
import { JwtStrategy } from '@rahino/auth/strategy';
import { JwtModule } from '@nestjs/jwt';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { PermissionMenu } from '@rahino/database/models/core/permission-menu.entity';

@Module({
  imports: [
    JwtModule.register({}),
    RedisClientModule,
    SequelizeModule.forFeature([User, Menu, RolePermission, PermissionMenu]),
  ],
  controllers: [LoginController],
  providers: [AuthService, JwtStrategy, LoginService],
})
export class LoginModule {}
