import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role, User, UserRole } from '@rahino/database';
import { ECLogisticUser } from '@rahino/localdatabase/models';
import { LogisticUserRoleHandlerService } from './logistic-user-role-handler.service';
import { LogisticUserRoleHandlerProfile } from './mapper';
import { UserRoleModule } from '@rahino/core/admin/user-role/user-role.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    UserRoleModule,
    SequelizeModule.forFeature([Role, UserRole, User, ECLogisticUser]),
    LocalizationModule,
  ],
  providers: [LogisticUserRoleHandlerService, LogisticUserRoleHandlerProfile],
  exports: [LogisticUserRoleHandlerService],
})
export class LogisticUserRoleHandlerModule {}
