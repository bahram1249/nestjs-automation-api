import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNNodeCommand,
  BPMNNode,
  BPMNNodeCommandType,
} from '@rahino/localdatabase/models';
import { NodeCommandController } from './node-command.controller';
import { NodeCommandService } from './node-command.service';
import { Permission, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User,
      Permission,
      BPMNNodeCommand,
      BPMNNode,
      BPMNNodeCommandType,
    ]),
  ],
  controllers: [NodeCommandController],
  providers: [NodeCommandService],
})
export class AdminNodeCommandModule {}
