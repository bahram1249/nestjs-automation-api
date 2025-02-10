import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNAction } from '@rahino/database';
import { ActionService } from './action.service';
import { ActionLoaderModule } from '../action-loader';

@Module({
  imports: [
    ActionLoaderModule.register(),
    SequelizeModule,
    SequelizeModule.forFeature([BPMNAction]),
  ],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
