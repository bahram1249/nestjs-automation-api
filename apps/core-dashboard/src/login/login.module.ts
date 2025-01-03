import { Module } from '@nestjs/common';
import { JwtWebStrategy } from '@rahino/auth';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@rahino/core/auth/auth.service';
import { Menu } from '@rahino/database';
import { Role } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { PermissionMenu } from '@rahino/database';

@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([
      User,
      Permission,
      Menu,
      Role,
      RolePermission,
      PermissionMenu,
      Menu,
    ]),
  ],
  controllers: [LoginController],
  providers: [JwtWebStrategy, LoginService, AuthService],
  exports: [LoginService],
})
export class LoginModule {}
