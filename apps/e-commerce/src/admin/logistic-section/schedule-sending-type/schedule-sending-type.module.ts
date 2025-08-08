import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ScheduleSendingTypeController } from './schedule-sending-type.controller';
import { ScheduleSendingTypeService } from './schedule-sending-type.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { ECScheduleSendingType } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';

@Module({
  imports: [
    SessionModule,
    SequelizeModule.forFeature([User, Permission, ECScheduleSendingType]),
    LocalizationModule,
  ],
  controllers: [ScheduleSendingTypeController],
  providers: [ScheduleSendingTypeService],
})
export class ScheduleSendingTypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
