import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNOutboundAction,
  BPMNActivity,
  BPMNAction,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GetOutboundActionDto } from './dto/get-outbound-action.dto';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class OutboundActionService {
  constructor(
    @InjectModel(BPMNOutboundAction)
    private readonly repository: typeof BPMNOutboundAction,
  ) {}

  async findAll(filter: GetOutboundActionDto) {
    let qb = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('BPMNOutboundAction.isDeleted'),
            0,
          ),
          { [Op.eq]: 0 },
        ),
      )
      .filterIf(!!filter.activityId, { activityId: filter.activityId })
      .filterIf(!!filter.actionId, { actionId: filter.actionId });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes(['id', 'activityId', 'actionId', 'priority'])
      .include([
        {
          model: BPMNActivity,
          as: 'activity',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNAction,
          as: 'action',
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

  async lookup(filter: GetOutboundActionDto) {
    const qbBase = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('BPMNOutboundAction.isDeleted'),
            0,
          ),
          { [Op.eq]: 0 },
        ),
      )
      .filterIf(!!filter.activityId, { activityId: filter.activityId })
      .filterIf(!!filter.actionId, { actionId: filter.actionId });

    const total = await this.repository.count(qbBase.build());

    const qbList = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('BPMNOutboundAction.isDeleted'),
            0,
          ),
          { [Op.eq]: 0 },
        ),
      )
      .attributes(['id', 'activityId', 'actionId', 'priority'])
      .filterIf(!!filter.activityId, { activityId: filter.activityId })
      .filterIf(!!filter.actionId, { actionId: filter.actionId })
      .include([
        {
          model: BPMNActivity,
          as: 'activity',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNAction,
          as: 'action',
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
        .attributes(['id', 'activityId', 'actionId', 'priority'])
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('BPMNOutboundAction.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .include([
          { model: BPMNActivity, as: 'activity', attributes: ['id', 'name'] },
          { model: BPMNAction, as: 'action', attributes: ['id', 'name'] },
        ])
        .build(),
    );
    if (!item) throw new NotFoundException('bpmn.outbound_action_not_found');
    return { result: item };
  }

  async create(data: Partial<BPMNOutboundAction>) {
    const created = await this.repository.create(
      JSON.parse(JSON.stringify(data)),
    );
    return { result: created };
  }

  async update(id: number, data: Partial<BPMNOutboundAction>) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item) throw new NotFoundException('bpmn.outbound_action_not_found');
    await item.update(JSON.parse(JSON.stringify(data)));
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id }).build(),
    );
    if (!item) throw new NotFoundException('bpmn.outbound_action_not_found');
    await item.update({ isDeleted: 1 } as any);
    return { ok: true };
  }
}
