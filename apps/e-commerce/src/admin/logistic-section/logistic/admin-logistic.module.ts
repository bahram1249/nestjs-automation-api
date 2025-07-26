import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AdminLogisticController } from './admin-logistic.controller';
import { LogisticService } from './admin-logistic.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission, Role } from '@rahino/database';
import { User } from '@rahino/database';
import { LogisticProfile } from './mapper';
import { UserRoleModule } from '@rahino/core/admin/user-role/user-role.module';
import { ECLogistic, ECLogisticUser } from '@rahino/localdatabase/models';
import { MinioClientModule } from '@rahino/minio-client';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { SessionModule } from '@rahino/ecommerce/user/session/session.module';

@Module({
  imports: [
    SessionModule,
    UserRoleModule,
    MinioClientModule,
    SequelizeModule.forFeature([
      User,
      Permission,
      Role,
      ECLogistic,
      ECLogisticUser,
    ]),
    SequelizeModule,
    LocalizationModule,
  ],
  controllers: [AdminLogisticController],
  providers: [LogisticService, LogisticProfile],
})
export class AdminLogisticModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
