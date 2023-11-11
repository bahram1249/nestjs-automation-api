import { Module } from '@nestjs/common';
import { GetUser } from './decorator';
import { JwtGuard } from './guard';
import { JwtStrategy } from './strategy';

@Module({
  providers: [JwtStrategy],
  exports: [GetUser, JwtGuard, JwtStrategy],
})
export class AuthModule {}
