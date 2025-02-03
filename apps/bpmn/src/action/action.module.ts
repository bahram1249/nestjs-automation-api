import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNAction } from '@rahino/database';
import { ActionService } from './action.service';

@Module({
  imports: [SequelizeModule, SequelizeModule.forFeature([BPMNAction])],
  providers: [ActionService],
  exports: [ActionService],
})
export class ActionModule {}
