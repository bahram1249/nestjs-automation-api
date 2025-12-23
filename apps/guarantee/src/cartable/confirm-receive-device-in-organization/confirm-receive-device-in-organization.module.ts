import { Module } from '@nestjs/common';
import { ConfirmReceiveDeviceInOrganizationService } from './confirm-receive-device-in-organization.service';
import { ConfirmReceiveDeviceInOrganizationController } from './confirm-receive-device-in-organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import {
  GSRequestAttachment,
  GSRequestItem,
} from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
    SequelizeModule.forFeature([
      GSRequestItem,
      Attachment,
      GSRequestAttachment,
    ]),
  ],
  controllers: [ConfirmReceiveDeviceInOrganizationController],
  providers: [ConfirmReceiveDeviceInOrganizationService],
  exports: [ConfirmReceiveDeviceInOrganizationService],
})
export class ConfirmReceiveDeviceInOrganizationModule {}
