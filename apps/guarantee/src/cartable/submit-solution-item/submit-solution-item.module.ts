import { Module } from '@nestjs/common';
import { SubmitSolutionItemService } from './submit-solution-item.service';
import { SubmitSolutionItemController } from './submit-solution-item.controller';
import { SequelizeModule } from '@nestjs/sequelize';
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
  ],
  controllers: [SubmitSolutionItemController],
  providers: [SubmitSolutionItemService],
  exports: [SubmitSolutionItemService],
})
export class SubmitSolutionItemModule {}
