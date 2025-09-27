import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNActivityType } from '@rahino/localdatabase/models';
import { ActivityTypeApiController } from './activity-type.controller';
import { ActivityTypeApiService } from './activity-type.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BPMNActivityType])],
  controllers: [ActivityTypeApiController],
  providers: [ActivityTypeApiService],
})
export class AdminActivityTypeApiModule {}
