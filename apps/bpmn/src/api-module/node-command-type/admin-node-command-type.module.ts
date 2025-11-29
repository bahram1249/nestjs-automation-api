import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNNodeCommandType } from '@rahino/localdatabase/models';
import { NodeCommandTypeController } from './node-command-type.controller';
import { NodeCommandTypeService } from './node-command-type.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, BPMNNodeCommandType]),
  ],
  controllers: [NodeCommandTypeController],
  providers: [NodeCommandTypeService],
})
export class AdminNodeCommandTypeModule {}
