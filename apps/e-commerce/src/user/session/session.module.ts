import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { SessionGuard } from './guard/session.guard';
import { RedisClientModule } from '@rahino/redis-client';

@Module({
  imports: [SequelizeModule.forFeature([ECUserSession]), RedisClientModule],
  controllers: [SessionController],
  providers: [SessionService, SessionGuard],
  exports: [SessionGuard],
})
export class SessionModule {}
