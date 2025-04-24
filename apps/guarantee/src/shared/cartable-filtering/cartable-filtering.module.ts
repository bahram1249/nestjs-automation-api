import { Module } from '@nestjs/common';
import { BPMNOrganizationUserModule } from '@rahino/bpmn/modules/organization-user/organization-user.module';

import { SharedCartableFilteringService } from './cartable-filtering.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequestState } from '@rahino/localdatabase/models';
import { RoleModule } from '@rahino/core/user/role/role.module';

@Module({
  imports: [
    BPMNOrganizationUserModule,
    RoleModule,

    SequelizeModule.forFeature([BPMNRequestState]),
  ],
  providers: [SharedCartableFilteringService],
  exports: [SharedCartableFilteringService],
})
export class SharedCartableFilteringModule {}
