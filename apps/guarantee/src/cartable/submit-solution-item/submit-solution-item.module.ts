import { Module } from '@nestjs/common';
import { SubmitSolutionItemService } from './submit-solution-item.service';
import { SubmitSolutionItemController } from './submit-solution-item.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNRequest,
  GSFactor,
  GSFactorService,
  GSGuaranteeOrganization,
  GSPaymentGateway,
  GSRequest,
  GSTransaction,
} from '@rahino/localdatabase/models';
import { GuaranteeTraverseModule } from '../guarantee-traverse/guarantee-traverse.module';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { GSCartableSolutionModule } from '../solution';
import { RialPriceModule } from '@rahino/guarantee/shared/rial-price';

@Module({
  imports: [
    GuaranteeTraverseModule,
    SequelizeModule,
    SequelizeModule.forFeature([
      GSRequest,
      BPMNRequest,
      GSFactor,
      GSFactorService,
      GSGuaranteeOrganization,
      GSTransaction,
      GSPaymentGateway,
    ]),
    TraverseModule,
    LocalizationModule,
    GSCartableSolutionModule,
    RialPriceModule,
  ],
  controllers: [SubmitSolutionItemController],
  providers: [SubmitSolutionItemService],
  exports: [SubmitSolutionItemService],
})
export class SubmitSolutionItemModule {}
