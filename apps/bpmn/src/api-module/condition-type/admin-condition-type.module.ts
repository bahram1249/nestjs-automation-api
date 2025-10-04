import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNConditionType } from '@rahino/localdatabase/models';
import { ConditionTypeController } from './condition-type.controller';
import { ConditionTypeService } from './condition-type.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BPMNConditionType])],
  controllers: [ConditionTypeController],
  providers: [ConditionTypeService],
})
export class AdminConditionTypeModule {}
