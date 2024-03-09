import { Module } from '@nestjs/common';
import { JwtWebStrategy } from '@rahino/auth/strategy';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@rahino/core/auth/auth.service';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { Role } from '@rahino/database/models/core/role.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { PermissionMenu } from '@rahino/database/models/core/permission-menu.entity';

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
