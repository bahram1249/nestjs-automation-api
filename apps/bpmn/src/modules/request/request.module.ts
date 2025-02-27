import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { RequestService } from './request.service';
import {
  BPMNOrganization,
  BPMNPROCESS,
  BPMNRequest,
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
    ]),
    TraverseModule,
    RequestStateModule,
  ],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestModule {}
