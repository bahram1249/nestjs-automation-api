import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNActionType } from '@rahino/localdatabase/models';
import { ActionTypeController } from './action-type.controller';
import { ActionTypeService } from './action-type.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([User, Permission, BPMNActionType])],
  controllers: [ActionTypeController],
  providers: [ActionTypeService],
})
export class AdminActionTypeModule {}
