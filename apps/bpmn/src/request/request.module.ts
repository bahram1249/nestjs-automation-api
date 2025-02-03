import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TraverseModule } from '@rahino/bpmn/traverse/traverse.module';
import { RequestService } from './request.service';
import {
  BPMNOrganization,
  BPMNPROCESS,
  BPMNRequest,
  BPMNRequestState,
  User,
} from '@rahino/database';
import { RequestStateModule } from '../request-state';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([
      BPMNRequest,
      BPMNPROCESS,
      BPMNOrganization,
      User,
    ]),
    TraverseModule,
    RequestStateModule,
  ],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
