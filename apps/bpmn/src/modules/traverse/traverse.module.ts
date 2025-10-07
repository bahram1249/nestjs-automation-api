import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNNode,
  BPMNOrganizationUser,
  BPMNRequestHistory,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { UserRole } from '@rahino/database';
import { ConditionModule } from '../condition';
import { ActionModule } from '../action';
import { RequestStateModule } from '../request-state';
import { TraverseService } from './traverse.service';
import { HistoryModule } from '../history';
import { NodeModule } from '../node';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BPMNNode,
      UserRole,
      BPMNRequestState,
      BPMNOrganizationUser,
      BPMNRequestHistory,
    ]),
    ConditionModule,
    ActionModule,
    RequestStateModule,
    HistoryModule,
    NodeModule,
  ],
  providers: [TraverseService],
  exports: [TraverseService],
})
export class TraverseModule {}
