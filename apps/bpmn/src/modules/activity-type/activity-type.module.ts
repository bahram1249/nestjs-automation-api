import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNActionType } from '@rahino/localdatabase/models';
import { ActivityTypeService } from './activity-type.service';

@Module({
  imports: [SequelizeModule.forFeature([BPMNActionType])],
  providers: [ActivityTypeService],
  exports: [ActivityTypeService],
})
export class ActivityTypeModule {}
