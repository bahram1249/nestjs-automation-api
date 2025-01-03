import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HeaderNotificationController } from './notification.controller';
import { HeaderNotificationService } from './notification.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Setting } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([Setting])],
  controllers: [HeaderNotificationController],
  providers: [HeaderNotificationService],
})
export class UserHeaderNotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
