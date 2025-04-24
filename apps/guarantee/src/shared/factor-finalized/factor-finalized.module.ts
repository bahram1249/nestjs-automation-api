import { Module } from '@nestjs/common';
import { FactorFinalizedService } from './factor-service.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNNode,
  BPMNNodeCommand,
  BPMNRequest,
  BPMNRequestState,
  GSAssignedGuarantee,
  GSAssignedGuaranteeAdditionalPackage,
  GSFactor,
  GSFactorAdditionalPackage,
  GSFactorVipBundle,
  GSGuarantee,
} from '@rahino/localdatabase/models';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';
import { GuaranteeTraverseModule } from '@rahino/guarantee/cartable/guarantee-traverse/guarantee-traverse.module';

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
    ]),
    TraverseModule,
    GuaranteeTraverseModule,
  ],
  providers: [FactorFinalizedService],
  exports: [FactorFinalizedService],
})
export class FactorFinalizedModule {}
