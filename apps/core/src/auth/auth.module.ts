import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@rahino/database';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtStrategy } from '@rahino/auth';
import { Menu } from '@rahino/database';
import { Role } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { PermissionMenu } from '@rahino/database';

// , ...userProviders

@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([
      User,
      Menu,
      Role,
      RolePermission,
      PermissionMenu,
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthModule, AuthService],
})
export class AuthModule {}
