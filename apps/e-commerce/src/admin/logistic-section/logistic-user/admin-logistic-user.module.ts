import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminLogisticUserController } from './admin-logistic-user.controller';
import { AdminLogisticUserService } from './admin-logistic-user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { User } from '@rahino/database';
import { UserRoleModule } from '@rahino/core/admin/user-role/user-role.module';
import { ECLogistic, ECLogisticUser } from '@rahino/localdatabase/models';
import { MinioClientModule } from '@rahino/minio-client';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';
import { LogisticUserRoleHandlerModule } from '../logistic-user-role-handler/logistic-user-role-handler.module';

@Module({
  imports: [
    SessionModule,
    UserRoleModule,
    SequelizeModule.forFeature([User, Permission, ECLogisticUser]),
    SequelizeModule,
    LocalizationModule,
    LogisticUserRoleHandlerModule,
  ],
  controllers: [AdminLogisticUserController],
  providers: [AdminLogisticUserService],
})
export class AdminLogisticUserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
