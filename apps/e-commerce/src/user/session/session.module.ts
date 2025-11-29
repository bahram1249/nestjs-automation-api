import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECUserSession } from '@rahino/localdatabase/models';
import { SessionGuard } from './guard/session.guard';
import { RedisClientModule } from '@rahino/redis-client';
import { ValidateSessionService } from './guard/validate-session.service';
import { OptionalSessionGuard, SessionIgnoreUserGuard } from './guard';

@Module({
  imports: [SequelizeModule.forFeature([ECUserSession]), RedisClientModule],
  controllers: [SessionController],
  providers: [
    SessionService,
    SessionGuard,
    SessionIgnoreUserGuard,
    OptionalSessionGuard,
    ValidateSessionService,
  ],
  exports: [
    SessionGuard,
    OptionalSessionGuard,
    SessionIgnoreUserGuard,
    ValidateSessionService,
  ],
})
export class SessionModule {}
