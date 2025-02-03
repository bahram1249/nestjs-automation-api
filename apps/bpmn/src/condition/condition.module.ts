import { Module } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNCondition } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([BPMNCondition])],
  providers: [ConditionService],
  exports: [ConditionService],
})
export class ConditionModule {}
