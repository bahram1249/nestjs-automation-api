import { Module } from '@nestjs/common';
import { TrackingRequestService } from './tracking-request.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Permission } from '@rahino/database';
import { TrackingRequestController } from './tracking-request.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { RoleModule } from '@rahino/core/user/role/role.module';
import { BPMNOrganizationUserModule } from '@rahino/bpmn/modules/organization-user/organization-user.module';
import { SharedCartableFilteringModule } from '@rahino/guarantee/shared/cartable-filtering/cartable-filtering.module';

@Module({
  imports: [
    BPMNOrganizationUserModule,
    RoleModule,
    LocalizationModule,
    SequelizeModule.forFeature([User, Permission]),
    SharedCartableFilteringModule,
  ],
  controllers: [TrackingRequestController],
  providers: [TrackingRequestService],
  exports: [TrackingRequestService],
})
export class GSTrackingRequestModule {}
