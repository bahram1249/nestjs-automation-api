import { Module } from '@nestjs/common';
import { TraverseService } from '@rahino/bpmn/traverse/traverse.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNNode,
  BPMNPROCESS,
  BPMNRequestState,
  UserRole,
} from '@rahino/database';
import { ConditionModule } from '../condition';
import { ActionModule } from '../action';
import { RequestStateModule } from '../request-state';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BPMNPROCESS,
      BPMNNode,
      UserRole,
      BPMNRequestState,
    ]),
    ConditionModule,
    ActionModule,
    RequestStateModule,
  ],
  providers: [TraverseService],
  exports: [TraverseService],
})
export class TraverseModule {}
