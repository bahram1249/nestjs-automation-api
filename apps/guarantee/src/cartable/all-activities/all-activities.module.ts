import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { AllActivitiesService } from './all-activities.service';
import { AllActivitiesController } from './all-activities.controller';
import { BPMNActivity } from '@rahino/localdatabase/models/bpmn';

@Module({
  imports: [SequelizeModule.forFeature([BPMNActivity, User])],
  controllers: [AllActivitiesController],
  providers: [AllActivitiesService],
  exports: [AllActivitiesService],
})
export class GSAllActivitiesModule {}
