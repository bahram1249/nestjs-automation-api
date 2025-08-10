import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminLogisticShipmentWayController } from './admin-logistic-shipmentway.controller';
import { AdminLogisticShipmentWayService } from './admin-logistic-shipmentway.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { UserRoleModule } from '@rahino/core/admin/user-role/user-role.module';
import { ECLogisticShipmentWay } from '@rahino/localdatabase/models';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';
import { LogisticUserRoleHandlerModule } from '../logistic-user-role-handler/logistic-user-role-handler.module';

@Module({
  imports: [
    SessionModule,
    UserRoleModule,
    SequelizeModule.forFeature([User, Permission, ECLogisticShipmentWay]),
    SequelizeModule,
    LocalizationModule,
    LogisticUserRoleHandlerModule,
  ],
  controllers: [AdminLogisticShipmentWayController],
  providers: [AdminLogisticShipmentWayService],
})
export class AdminLogisticShipmentWayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
