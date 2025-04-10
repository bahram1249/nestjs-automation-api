import { Module } from '@nestjs/common';
import { SubmitSolutionItemInRequestLocationService } from './submit-solution-item-in-request-location.service';
import { SubmitSolutionItemInRequestLocationController } from './submit-solution-item-in-request-location.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { RequestFactorModule } from '@rahino/guarantee/shared/request-factor';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    TraverseModule,
    LocalizationModule,
    RequestFactorModule,
    SequelizeModule.forFeature([GSRequest]),
  ],
  controllers: [SubmitSolutionItemInRequestLocationController],
  providers: [SubmitSolutionItemInRequestLocationService],
  exports: [SubmitSolutionItemInRequestLocationService],
})
export class SubmitSolutionItemInRequestLocationModule {}
