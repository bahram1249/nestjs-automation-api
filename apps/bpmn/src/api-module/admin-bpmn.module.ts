import { Module } from '@nestjs/common';
import { AdminProcessModule } from './process/admin-process.module';
import { AdminActivityModule } from './activity/admin-activity.module';
import { AdminNodeModule } from './node/admin-node.module';
import { AdminRequestModule } from './request/admin-request.module';
import { AdminRequestStateModule } from './request-state/admin-request-state.module';
import { AdminActivityTypeApiModule } from './activity-type/admin-activity-type.module';
import { AdminReferralTypeModule } from './referral-type/admin-referral-type.module';
import { AdminConditionModule } from './condition/admin-condition.module';
import { AdminActionModule } from './action/admin-action.module';
import { AdminConditionTypeModule } from './condition-type/admin-condition-type.module';
import { AdminActionTypeModule } from './action-type/admin-action-type.module';
import { AdminOrganizationApiModule } from './organization/admin-organization.module';
import { AdminInboundActionModule } from './inbound-action/admin-inbound-action.module';
import { AdminOutboundActionModule } from './outbound-action/admin-outbound-action.module';
import { AdminNodeConditionModule } from './node-condition/admin-node-condition.module';
import { AdminNodeCommandModule } from './node-command/admin-node-command.module';
import { AdminNodeCommandTypeModule } from './node-command-type/admin-node-command-type.module';
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
    AdminConditionModule,
    AdminActionModule,
    AdminConditionTypeModule,
    AdminActionTypeModule,
    AdminInboundActionModule,
    AdminOutboundActionModule,
    AdminNodeConditionModule,
    AdminNodeCommandModule,
    AdminNodeCommandTypeModule,
  ],
})
export class AdminBpmnModule {}
