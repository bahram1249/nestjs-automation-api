import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@rahino/database/models/core/user.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JwtStrategy } from '@rahino/auth/strategy';

// , ...userProviders

@Module({
  imports: [JwtModule.register({}), SequelizeModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthModule, AuthService],
})
export class AuthModule {}
