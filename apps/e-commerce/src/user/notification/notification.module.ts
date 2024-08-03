import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { ECNotification } from '@rahino/database/models/ecommerce-eav/ec-notification.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, ECNotification])],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
