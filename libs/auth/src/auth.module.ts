import { Module } from '@nestjs/common';
import { GetUser } from './decorator';
import {
  JwtGuard,
  JwtWebGuard,
  OptionalJwtGuard,
  OptionalJwtWebGuard,
} from './guard';
import { JwtStrategy } from './strategy';

@Module({
  providers: [JwtStrategy],
  exports: [
    GetUser,
    JwtGuard,
    JwtWebGuard,
    OptionalJwtGuard,
    OptionalJwtWebGuard,
    JwtStrategy,
  ],
})
export class AuthModule {}
