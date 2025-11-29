import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNAction, BPMNActionType } from '@rahino/localdatabase/models';
import { ActionController } from './action.controller';
import { ActionService } from './action.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, BPMNAction, BPMNActionType]),
  ],
  controllers: [ActionController],
  providers: [ActionService],
})
export class AdminActionModule {}
