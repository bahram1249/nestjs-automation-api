import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNCondition, BPMNConditionType } from '@rahino/localdatabase/models';
import { ConditionController } from './condition.controller';
import { ConditionService } from './condition.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BPMNCondition,
      BPMNConditionType,
    ]),
  ],
  controllers: [ConditionController],
  providers: [ConditionService],
})
export class AdminConditionModule {}
