import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNActivityType,
  BPMNPROCESS,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { CreateActivityDto, GetActivityDto, UpdateActivityDto } from './dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectModel(BPMNActivity)
    private readonly repository: typeof BPMNActivity,
  ) {}

  async findAll(filter: GetActivityDto) {
    let qb = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNActivity.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search },
      })
      .filterIf(!!filter.processId, { processId: filter.processId });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        'name',
        'isStartActivity',
        'isEndActivity',
        'activityTypeId',
        'processId',
        'haveMultipleItems',
        'insideProcessRunnerId',
      ])
      .include([
        {
          model: BPMNPROCESS,
          as: 'process',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNActivityType,
          as: 'activityType',
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

  async lookup(filter: GetActivityDto) {
    // Base filters (no pagination) for counting
    const qbBase = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNActivity.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search },
      })
      .filterIf(!!filter.processId, { processId: filter.processId });

    const total = await this.repository.count(qbBase.build());

    // List query with attributes, includes and pagination (explicitly rebuild to avoid relying on clone)
    const qbList = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNActivity.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search },
      })
      .filterIf(!!filter.processId, { processId: filter.processId })
      .attributes(['id', 'name', 'processId'])
      .include([
        {
          model: BPMNPROCESS,
          as: 'process',
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
        .attributes([
          'id',
          'name',
          'isStartActivity',
          'isEndActivity',
          'activityTypeId',
          'processId',
          'haveMultipleItems',
          'insideProcessRunnerId',
        ])
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNActivity.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) throw new NotFoundException('bpmn.activity_not_found');
    return { result: item };
  }

  async create(dto: CreateActivityDto) {
    const created = await this.repository.create({ ...dto });
    return { result: created };
  }

  async update(id: number, dto: UpdateActivityDto) {
    const item = await this.repository.findByPk(id);
    if (!item || item.isDeleted === true) {
      throw new NotFoundException('bpmn.activity_not_found');
    }
    await item.update({ ...dto });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findByPk(id);
    if (!item || item.isDeleted === true) {
      throw new NotFoundException('bpmn.activity_not_found');
    }
    await item.update({ isDeleted: true });
    return { ok: true };
  }
}
