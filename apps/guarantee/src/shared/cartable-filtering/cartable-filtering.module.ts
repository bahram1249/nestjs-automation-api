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
import { GSCartableFactorModule } from '@rahino/guarantee/cartable/cartable-factor/cartable-factor.module';

@Module({
  imports: [
    BPMNOrganizationUserModule,
    RoleModule,
    SequelizeModule.forFeature([
      BPMNRequestState,
      BPMNOrganizationUser,
      UserRole,
    ]),
    GSCartableFactorModule,
  ],
  providers: [SharedCartableFilteringService],
  exports: [SharedCartableFilteringService],
})
export class SharedCartableFilteringModule {}
