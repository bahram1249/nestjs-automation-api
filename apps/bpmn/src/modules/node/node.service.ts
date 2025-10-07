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

@Injectable()
export class NodeService {
  constructor(
    @InjectModel(BPMNNode) private readonly nodeRepository: typeof BPMNNode,
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
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('nodeCommands.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
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
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNNode.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: dto.id })
        .build(),
    );
  }
}
