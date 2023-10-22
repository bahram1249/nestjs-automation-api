import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy';
import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';

// , ...userProviders

@Module({
  imports: [JwtModule.register({}), SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthModule, AuthService],
})
export class AuthModule {}
