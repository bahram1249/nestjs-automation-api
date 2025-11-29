import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNNodeCommand,
  BPMNNode,
  BPMNNodeCommandType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { GetNodeCommandDto } from './dto/get-node-command.dto';

@Injectable()
export class NodeCommandService {
  constructor(
    @InjectModel(BPMNNodeCommand)
    private readonly repository: typeof BPMNNodeCommand,
  ) {}

  async findAll(filter: GetNodeCommandDto) {
    let qb = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNNodeCommand.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.nodeId, { nodeId: filter.nodeId })
      .filterIf(!!filter.nodeCommandTypeId, {
        nodeCommandTypeId: filter.nodeCommandTypeId,
      });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes(['id', 'nodeId', 'name', 'nodeCommandTypeId', 'route'])
      .include([
        {
          model: BPMNNode,
          as: 'node',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNNodeCommandType,
          as: 'nodeCommandType',
          attributes: ['id', 'name'],
          required: false,
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async lookup(filter: GetNodeCommandDto) {
    const qbBase = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNNodeCommand.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.nodeId, { nodeId: filter.nodeId })
      .filterIf(!!filter.nodeCommandTypeId, {
        nodeCommandTypeId: filter.nodeCommandTypeId,
      });

    const total = await this.repository.count(qbBase.build());

    const qbList = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNNodeCommand.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .attributes(['id', 'nodeId', 'name', 'nodeCommandTypeId'])
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.nodeId, { nodeId: filter.nodeId })
      .filterIf(!!filter.nodeCommandTypeId, {
        nodeCommandTypeId: filter.nodeCommandTypeId,
      })
      .include([
        {
          model: BPMNNode,
          as: 'node',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNNodeCommandType,
          as: 'nodeCommandType',
          attributes: ['id', 'name'],
          required: false,
        },
      ])
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qbList.build());
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'nodeId', 'name', 'nodeCommandTypeId', 'route'])
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('BPMNNodeCommand.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .include([
          { model: BPMNNode, as: 'node', attributes: ['id', 'name'] },
          {
            model: BPMNNodeCommandType,
            as: 'nodeCommandType',
            attributes: ['id', 'name'],
          },
        ])
        .build(),
    );
    if (!item) throw new NotFoundException('bpmn.node_command_not_found');
    return { result: item };
  }

  async create(data: Partial<BPMNNodeCommand>) {
    const created = await this.repository.create(
      JSON.parse(JSON.stringify(data)),
    );
    return { result: created };
  }

  async update(id: number, data: Partial<BPMNNodeCommand>) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item) throw new NotFoundException('bpmn.node_command_not_found');
    await item.update(JSON.parse(JSON.stringify(data)));
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item) throw new NotFoundException('bpmn.node_command_not_found');
    await item.update({ isDeleted: true } as any);
    return { ok: true };
  }
}
