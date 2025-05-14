import { Module } from '@nestjs/common';
import { BPMNOrganizationUserModule } from '@rahino/bpmn/modules/organization-user/organization-user.module';

import { SharedCartableFilteringService } from './cartable-filtering.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNOrganizationUser,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { RoleModule } from '@rahino/core/user/role/role.module';
import { UserRole } from '@rahino/database';

@Module({
  imports: [
    BPMNOrganizationUserModule,
    RoleModule,

    SequelizeModule.forFeature([
      BPMNRequestState,
      BPMNOrganizationUser,
      UserRole,
    ]),
  ],
  providers: [SharedCartableFilteringService],
  exports: [SharedCartableFilteringService],
})
export class SharedCartableFilteringModule {}
