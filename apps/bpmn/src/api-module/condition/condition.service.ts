import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNCondition, BPMNConditionType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GetConditionDto } from './dto/get-condition.dto';
import { Op, Sequelize } from 'sequelize';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@Injectable()
export class ConditionService {
  constructor(
    @InjectModel(BPMNCondition)
    private readonly repository: typeof BPMNCondition,
  ) {}

  async findAll(filter: GetConditionDto) {
    let qb = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNCondition.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.conditionTypeId, {
        conditionTypeId: filter.conditionTypeId,
      });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        'name',
        'conditionTypeId',
        'conditionSource',
        'conditionText',
      ])
      .include([
        {
          model: BPMNConditionType,
          as: 'conditionType',
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

  async lookup(filter: GetConditionDto) {
    // count with filters
    const qbBase = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNCondition.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.conditionTypeId, {
        conditionTypeId: filter.conditionTypeId,
      });

    const total = await this.repository.count(qbBase.build());

    const qbList = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNCondition.isDeleted'), 0),
          { [Op.eq]: 0 },
        ),
      )
      .attributes(['id', 'name', 'conditionTypeId'])
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search as any },
      })
      .filterIf(!!filter.conditionTypeId, {
        conditionTypeId: filter.conditionTypeId,
      })
      .include([
        {
          model: BPMNConditionType,
          as: 'conditionType',
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
          'conditionTypeId',
          'conditionSource',
          'conditionText',
        ])
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNCondition.isDeleted'), 0),
            { [Op.eq]: 0 },
          ),
        )
        .include([
          {
            model: BPMNConditionType,
            as: 'conditionType',
            attributes: ['id', 'name'],
          },
        ])
        .build(),
    );
    if (!item) throw new NotFoundException('bpmn.condition_not_found');
    return { result: item };
  }

  async create(dto: CreateConditionDto) {
    const created = await this.repository.create({ ...dto });
    return { result: created };
  }

  async update(id: number, dto: UpdateConditionDto) {
    const item = await this.repository.findByPk(id);
    if (!item || (item as any).isDeleted === true) {
      throw new NotFoundException('bpmn.condition_not_found');
    }
    await item.update({ ...dto });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findByPk(id);
    if (!item || (item as any).isDeleted === true) {
      throw new NotFoundException('bpmn.condition_not_found');
    }
    await item.update({ isDeleted: true });
    return { ok: true };
  }
}
