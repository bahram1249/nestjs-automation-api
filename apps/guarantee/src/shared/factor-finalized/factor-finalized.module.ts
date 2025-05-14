import { Module } from '@nestjs/common';
import { FactorFinalizedService } from './factor-finalized.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSAssignedGuarantee,
  GSAssignedGuaranteeAdditionalPackage,
  GSFactor,
  GSFactorAdditionalPackage,
  GSFactorVipBundle,
  GSGuarantee,
  GSPoint,
  GSUserPoint,
} from '@rahino/localdatabase/models';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { GuaranteeTraverseModule } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.module';
import { RialPriceModule } from '../rial-price';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      GSFactor,
      GSFactorAdditionalPackage,
      GSAssignedGuaranteeAdditionalPackage,
      GSAssignedGuarantee,
      GSFactorVipBundle,
      GSGuarantee,
      GSPoint,
      GSUserPoint,
    ]),
    TraverseModule,
    GuaranteeTraverseModule,
    RialPriceModule,
  ],
  providers: [FactorFinalizedService],
  exports: [FactorFinalizedService],
})
export class FactorFinalizedModule {}
