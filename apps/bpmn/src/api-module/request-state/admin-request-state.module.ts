import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNOrganization,
  BPMNRequest,
  BPMNRequestState,
  BPMNPROCESS,
} from '@rahino/localdatabase/models';
import { RequestStateController } from './request-state.controller';
import { RequestStateCrudService } from './request-state.service';
import { User, Permission, Role } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BPMNRequestState,
      BPMNRequest,
      BPMNActivity,
      BPMNOrganization,
      BPMNPROCESS,
      Role,
      User,
      Permission,
    ]),
  ],
  controllers: [RequestStateController],
  providers: [RequestStateCrudService],
})
export class AdminRequestStateModule {}
