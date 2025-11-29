import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNNodeCondition,
  BPMNNode,
  BPMNCondition,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GetNodeConditionDto } from './dto/get-node-condition.dto';
import { Op } from 'sequelize';

@Injectable()
export class NodeConditionService {
  constructor(
    @InjectModel(BPMNNodeCondition)
    private readonly repository: typeof BPMNNodeCondition,
  ) {}

  async findAll(filter: GetNodeConditionDto) {
    let qb = new QueryOptionsBuilder()
      .filterIf(!!filter.nodeId, { nodeId: filter.nodeId })
      .filterIf(!!filter.conditionId, { conditionId: filter.conditionId });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes(['nodeId', 'conditionId', 'priority'])
      .include([
        {
          model: BPMNNode,
          as: 'node',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNCondition,
          as: 'condition',
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

  async lookup(filter: GetNodeConditionDto) {
    const qbBase = new QueryOptionsBuilder()
      .filterIf(!!filter.nodeId, { nodeId: filter.nodeId })
      .filterIf(!!filter.conditionId, { conditionId: filter.conditionId });

    const total = await this.repository.count(qbBase.build());

    const qbList = new QueryOptionsBuilder()
      .attributes(['nodeId', 'conditionId', 'priority'])
      .filterIf(!!filter.nodeId, { nodeId: filter.nodeId })
      .filterIf(!!filter.conditionId, { conditionId: filter.conditionId })
      .include([
        {
          model: BPMNNode,
          as: 'node',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNCondition,
          as: 'condition',
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

  async findById(nodeId: number, conditionId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['nodeId', 'conditionId', 'priority'])
        .filter({ nodeId, conditionId })
        .include([
          { model: BPMNNode, as: 'node', attributes: ['id', 'name'] },
          { model: BPMNCondition, as: 'condition', attributes: ['id', 'name'] },
        ])
        .build(),
    );
    if (!item) throw new NotFoundException('bpmn.node_condition_not_found');
    return { result: item };
  }

  async create(data: Partial<BPMNNodeCondition>) {
    const created = await this.repository.create(
      JSON.parse(JSON.stringify(data)),
    );
    return { result: created };
  }

  async update(
    nodeId: number,
    conditionId: number,
    data: Partial<BPMNNodeCondition>,
  ) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ nodeId, conditionId }).build(),
    );
    if (!item) throw new NotFoundException('bpmn.node_condition_not_found');
    await item.update(JSON.parse(JSON.stringify(data)));
    return { result: item };
  }

  async delete(nodeId: number, conditionId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ nodeId, conditionId }).build(),
    );
    if (!item) throw new NotFoundException('bpmn.node_condition_not_found');
    await item.destroy();
    return { ok: true };
  }
}
