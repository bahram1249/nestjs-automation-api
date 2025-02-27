import { Module } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNNodeCondition } from '@rahino/localdatabase/models';
import { ConditionLoaderModule } from '../condition-loader';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([BPMNNodeCondition]),
    ConditionLoaderModule.register(),
  ],
  providers: [ConditionService],
  exports: [ConditionService],
})
export class ConditionModule {}
