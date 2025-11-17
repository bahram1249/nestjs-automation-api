import { Module } from '@nestjs/common';
import { ConfirmReceiveDeviceInOrganizationService } from './confirm-receive-device-in-organization.service';
import { ConfirmReceiveDeviceInOrganizationController } from './confirm-receive-device-in-organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSRequestItem } from '@rahino/localdatabase/models';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
    SequelizeModule.forFeature([GSRequestItem]),
  ],
  controllers: [ConfirmReceiveDeviceInOrganizationController],
  providers: [ConfirmReceiveDeviceInOrganizationService],
  exports: [ConfirmReceiveDeviceInOrganizationService],
})
export class ConfirmReceiveDeviceInOrganizationModule {}
