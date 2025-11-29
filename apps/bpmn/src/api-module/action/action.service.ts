import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNAction, BPMNActionType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GetActionDto } from './dto/get-action.dto';
import { Op, Sequelize } from 'sequelize';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionService {
  constructor(
    @InjectModel(BPMNAction)
    private readonly repository: typeof BPMNAction,
  ) {}

  async findAll(filter: GetActionDto) {
    let qb = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNAction.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.actionTypeId, { actionTypeId: filter.actionTypeId });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes(['id', 'name', 'actionTypeId', 'actionSource', 'actionText'])
      .include([
        {
          model: BPMNActionType,
          as: 'actionType',
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

  async lookup(filter: GetActionDto) {
    // count with filters
    const qbBase = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNAction.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.actionTypeId, { actionTypeId: filter.actionTypeId });

    const total = await this.repository.count(qbBase.build());

    const qbList = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNAction.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .attributes(['id', 'name', 'actionTypeId'])
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.actionTypeId, { actionTypeId: filter.actionTypeId })
      .include([
        {
          model: BPMNActionType,
          as: 'actionType',
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
          'actionTypeId',
          'actionSource',
          'actionText',
        ])
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNAction.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .include([
          {
            model: BPMNActionType,
            as: 'actionType',
            attributes: ['id', 'name'],
          },
        ])
        .build(),
    );
    if (!item) throw new NotFoundException('bpmn.action_not_found');
    return { result: item };
  }

  async create(dto: CreateActionDto) {
    const created = await this.repository.create({ ...dto });
    return { result: created };
  }

  async update(id: number, dto: UpdateActionDto) {
    const item = await this.repository.findByPk(id);
    if (!item || (item as any).isDeleted === true) {
      throw new NotFoundException('bpmn.action_not_found');
    }
    await item.update({ ...dto });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findByPk(id);
    if (!item || (item as any).isDeleted === true) {
      throw new NotFoundException('bpmn.action_not_found');
    }
    await item.update({ isDeleted: true });
    return { ok: true };
  }
}
