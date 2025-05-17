import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNRequestService } from './request.service';
import {
  BPMNOrganization,
  BPMNPROCESS,
  BPMNRequest,
  BPMNRequestState,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { RequestStateModule } from '../request-state';
import { TraverseModule } from '../traverse/traverse.module';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      BPMNRequest,
      BPMNPROCESS,
      BPMNOrganization,
      User,
      BPMNRequestState,
    ]),
    TraverseModule,
    RequestStateModule,
  ],
  providers: [BPMNRequestService],
  exports: [BPMNRequestService],
})
export class BPMNRequestModule {}
