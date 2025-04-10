import { Module } from '@nestjs/common';
import { PickTechnicalUserInOrganizationService } from './pick-technical-user-in-organization.service';
import { PickTechnicalUserInOrganizationController } from './pick-technical-user-in-organization.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSRequest } from '@rahino/localdatabase/models';

@Module({
  imports: [
    SequelizeModule.forFeature([GSRequest]),
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
  ],
  controllers: [PickTechnicalUserInOrganizationController],
  providers: [PickTechnicalUserInOrganizationService],
  exports: [PickTechnicalUserInOrganizationService],
})
export class PickTechnicalUserInOrganizationModule {}
