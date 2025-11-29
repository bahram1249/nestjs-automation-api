import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNNodeCondition,
  BPMNNode,
  BPMNCondition,
} from '@rahino/localdatabase/models';
import { NodeConditionController } from './node-condition.controller';
import { NodeConditionService } from './node-condition.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BPMNNodeCondition,
      BPMNNode,
      BPMNCondition,
    ]),
  ],
  controllers: [NodeConditionController],
  providers: [NodeConditionService],
})
export class AdminNodeConditionModule {}
