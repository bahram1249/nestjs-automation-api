import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNActivityType,
  BPMNPROCESS,
} from '@rahino/localdatabase/models';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BPMNActivity,
      BPMNActivityType,
      BPMNPROCESS,
      User,
      Permission,
    ]),
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class AdminActivityModule {}
