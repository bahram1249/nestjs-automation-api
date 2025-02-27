import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNAction,
  BPMNInboundAction,
  BPMNOutboundAction,
} from '@rahino/localdatabase/models';
import { ActionService } from './action.service';
import { ActionLoaderModule } from '../action-loader';

@Module({
  imports: [
    ActionLoaderModule.register(),
    SequelizeModule,
    SequelizeModule.forFeature([
      BPMNAction,
      BPMNInboundAction,
      BPMNOutboundAction,
    ]),
  ],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
