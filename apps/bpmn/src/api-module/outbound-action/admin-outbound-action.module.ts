import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNOutboundAction,
  BPMNActivity,
  BPMNAction,
} from '@rahino/localdatabase/models';
import { OutboundActionController } from './outbound-action.controller';
import { OutboundActionService } from './outbound-action.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BPMNOutboundAction,
      BPMNActivity,
      BPMNAction,
    ]),
  ],
  controllers: [OutboundActionController],
  providers: [OutboundActionService],
})
export class AdminOutboundActionModule {}
