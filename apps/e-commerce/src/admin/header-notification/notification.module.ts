import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HeaderNotificationController } from './notification.controller';
import { HeaderNotificationService } from './notification.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { Setting } from '@rahino/database/models/core/setting.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, Setting])],
  controllers: [HeaderNotificationController],
  providers: [HeaderNotificationService],
})
export class AdminHeaderNotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
