import { Injectable } from '@nestjs/common';
import { NodeFilterDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNNode,
  BPMNNodeCommand,
  BPMNNodeCommandType,
  BPMNPROCESS,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class NodeService {
  constructor(
    @InjectModel(BPMNNode) private readonly nodeRepository: typeof BPMNNode,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async filterNode(dto: NodeFilterDto) {
    return await this.nodeRepository.findOne(
      new QueryOptionsBuilder()
        .include([
          {
            model: BPMNNodeCommand,
            as: 'nodeCommands',
            required: true,
            where: {
              [Op.and]: [
                {
                  id: dto.nodeCommandId,
                },
                this.seqHelp.whereIsNullColumnEqualToZero(
                  'nodeCommands.isDeleted',
                  0,
                ),
              ],
            },
            include: [
              {
                model: BPMNNodeCommandType,
                as: 'nodeCommandType',
              },
            ],
          },
          {
            model: BPMNActivity,
            as: 'fromActivity',
            include: [
              {
                model: BPMNPROCESS,
                as: 'process',
              },
            ],
          },
          {
            model: BPMNActivity,
            as: 'toActivity',
            include: [
              {
                model: BPMNPROCESS,
                as: 'process',
              },
            ],
          },
        ])
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero('BPMNNode.isDeleted', 0),
        )
        .filter({ id: dto.id })
        .build(),
    );
  }
}
