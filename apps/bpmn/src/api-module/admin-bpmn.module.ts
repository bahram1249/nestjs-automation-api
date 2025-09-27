import { Module } from '@nestjs/common';
import { AdminProcessModule } from './process/admin-process.module';
import { AdminActivityModule } from './activity/admin-activity.module';
import { AdminNodeModule } from './node/admin-node.module';
import { AdminRequestModule } from './request/admin-request.module';
import { AdminRequestStateModule } from './request-state/admin-request-state.module';
import { AdminActivityTypeApiModule } from './activity-type/admin-activity-type.module';
import { AdminReferralTypeModule } from './referral-type/admin-referral-type.module';
import { AdminOrganizationApiModule } from './organization/admin-organization.module';

@Module({
  imports: [
    AdminProcessModule,
    AdminActivityModule,
    AdminNodeModule,
    AdminRequestModule,
    AdminRequestStateModule,
    AdminActivityTypeApiModule,
    AdminReferralTypeModule,
    AdminOrganizationApiModule,
  ],
})
export class AdminBpmnModule {}
