import { Module } from '@nestjs/common';
import { PickOrganizationService } from './pick-organization.service';
import { PickOrganizationController } from './pick-organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequest, GSRequest } from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    SequelizeModule.forFeature([GSRequest, BPMNRequest]),
    TraverseModule,
    LocalizationModule,
  ],
  controllers: [PickOrganizationController],
  providers: [PickOrganizationService],
  exports: [PickOrganizationService],
})
export class PickOrganizationModule {}
