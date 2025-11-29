import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNAction,
  BPMNNode,
  BPMNReferralType,
} from '@rahino/localdatabase/models';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { Permission, Role, User } from '@rahino/database';

@Module({
  imports: [
    SequelizeModule.forFeature([
      BPMNNode,
      BPMNActivity,
      BPMNReferralType,
      BPMNAction,
      Role,
      User,
      Permission,
    ]),
  ],
  controllers: [NodeController],
  providers: [NodeService],
})
export class AdminNodeModule {}
