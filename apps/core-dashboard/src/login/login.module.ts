import { Module } from '@nestjs/common';
import { WebJwtStrategy } from '@rahino/auth/strategy';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    SequelizeModule.forFeature([User, Permission]),
  ],
  controllers: [LoginController],
  providers: [WebJwtStrategy, LoginService],
  exports: [LoginService],
})
export class LoginModule {}
