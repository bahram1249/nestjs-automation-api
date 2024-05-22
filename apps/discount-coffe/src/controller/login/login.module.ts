import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { AuthService } from '@rahino/core/auth/auth.service';
import { JwtWebStrategy } from '@rahino/auth/strategy';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { PermissionMenu } from '@rahino/database/models/core/permission-menu.entity';
import { JwtModule } from '@nestjs/jwt';
import { SmsModule } from '@rahino/sms/sms.module';
import { MeliPayamakService } from '@rahino/sms/services/melipayamak.service';

@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([User, Menu, RolePermission, PermissionMenu]),
    SmsModule.register({
      token: 'meli_payamak',
      smsProvider: new MeliPayamakService(),
    }),
  ],
  controllers: [LoginController],
  providers: [JwtWebStrategy, LoginService, AuthService],
  exports: [LoginService],
})
export class LoginModule {}
