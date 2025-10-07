import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { BPMNNode } from '@rahino/localdatabase/models';
import { NodeService } from './node.service';

@Module({
  imports: [SequelizeModule.forFeature([BPMNNode])],
  providers: [NodeService],
  exports: [NodeService],
})
export class NodeModule {}
