import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { SessionGuard } from './guard/session.guard';
import { RedisClientModule } from '@rahino/redis-client';
import { APP_GUARD } from '@nestjs/core';
import { ValidateSessionService } from './guard/validate-session.service';
import { OptionalSessionGuard } from './guard';

@Module({
  imports: [SequelizeModule.forFeature([ECUserSession]), RedisClientModule],
  controllers: [SessionController],
  providers: [
    SessionService,
    SessionGuard,
    OptionalSessionGuard,
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: OptionalSessionGuard,
    },
    ValidateSessionService,
  ],
  exports: [SessionGuard, OptionalSessionGuard, ValidateSessionService],
})
export class SessionModule {}
