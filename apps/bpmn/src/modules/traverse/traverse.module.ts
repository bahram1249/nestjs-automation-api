import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNNode, BPMNRequestState } from '@rahino/localdatabase/models';
import { UserRole } from '@rahino/database';
import { ConditionModule } from '../condition';
import { ActionModule } from '../action';
import { RequestStateModule } from '../request-state';
import { TraverseService } from './traverse.service';
import { HistoryModule } from '../history';

@Module({
  imports: [
    SequelizeModule.forFeature([BPMNNode, UserRole, BPMNRequestState]),
    ConditionModule,
    ActionModule,
    RequestStateModule,
    HistoryModule,
  ],
  providers: [TraverseService],
  exports: [TraverseService],
})
export class TraverseModule {}
