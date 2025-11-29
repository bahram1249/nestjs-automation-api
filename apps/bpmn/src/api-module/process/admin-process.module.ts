import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNPROCESS,
  BPMNActivity,
  BPMNNode,
  BPMNInboundAction,
  BPMNOutboundAction,
  BPMNNodeCondition,
  BPMNNodeCommand,
  BPMNAction,
  BPMNCondition,
  BPMNNodeCommandType,
} from '@rahino/localdatabase/models';
import { ProcessController } from './process.controller';
import { ProcessService } from './process.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BPMNPROCESS,
      BPMNActivity,
      BPMNNode,
      BPMNInboundAction,
      BPMNOutboundAction,
      BPMNNodeCondition,
      BPMNNodeCommand,
      BPMNNodeCommandType,
      BPMNAction,
      BPMNCondition,
      User,
      Permission,
    ]),
  ],
  controllers: [ProcessController],
  providers: [ProcessService],
})
export class AdminProcessModule {}
