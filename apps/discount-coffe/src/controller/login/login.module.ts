import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { AuthService } from '@rahino/core/auth/auth.service';
import { JwtWebStrategy } from '@rahino/auth';
import { Menu } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { PermissionMenu } from '@rahino/database';
import { JwtModule } from '@nestjs/jwt';
import { SmsModule } from '@rahino/sms/sms.module';
import { MeliPayamakService } from '@rahino/sms/services/melipayamak.service';

@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([User, Menu, RolePermission, PermissionMenu]),
    SmsModule,
    // SmsModule.register({
    //   token: 'meli_payamak',
    //   smsProvider: new MeliPayamakService(),
    // }),
  ],
  controllers: [LoginController],
  providers: [JwtWebStrategy, LoginService, AuthService],
  exports: [LoginService],
})
export class LoginModule {}
