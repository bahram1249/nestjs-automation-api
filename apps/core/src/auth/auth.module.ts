import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@rahino/database/models/core/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtStrategy } from '@rahino/auth/strategy';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { Role } from '@rahino/database/models/core/role.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { PermissionMenu } from '@rahino/database/models/core/permission-menu.entity';

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
