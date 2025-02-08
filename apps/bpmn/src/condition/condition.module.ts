import { Module } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNCondition, BPMNNodeCondition } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule,
    SequelizeModule.forFeature([BPMNCondition, BPMNNodeCondition]),
  ],
  providers: [ConditionService],
  exports: [ConditionService],
})
export class ConditionModule {}
