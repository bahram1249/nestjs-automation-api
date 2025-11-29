import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNInboundAction,
  BPMNActivity,
  BPMNAction,
} from '@rahino/localdatabase/models';
import { InboundActionController } from './inbound-action.controller';
import { InboundActionService } from './inbound-action.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BPMNInboundAction,
      BPMNActivity,
      BPMNAction,
    ]),
  ],
  controllers: [InboundActionController],
  providers: [InboundActionService],
})
export class AdminInboundActionModule {}
