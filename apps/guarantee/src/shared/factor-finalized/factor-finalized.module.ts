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
} from '@rahino/localdatabase/models';
import { TraverseModule } from '@rahino/bpmn/modules/traverse/traverse.module';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      GSFactor,
      GSFactorAdditionalPackage,
      GSAssignedGuaranteeAdditionalPackage,
      GSAssignedGuarantee,
      BPMNRequest,
      BPMNNode,
      BPMNNodeCommand,
      BPMNRequestState,
    ]),
    TraverseModule,
  ],
  providers: [FactorFinalizedService],
  exports: [FactorFinalizedService],
})
export class FactorFinalizedModule {}
