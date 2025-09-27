import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNActivity,
  BPMNAction,
  BPMNNode,
  BPMNReferralType,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { CreateNodeDto, GetNodeDto, UpdateNodeDto } from './dto';
import { Role, User } from '@rahino/database';

@Injectable()
export class NodeService {
  constructor(
    @InjectModel(BPMNNode)
    private readonly repository: typeof BPMNNode,
  ) {}

  async findAll(filter: GetNodeDto) {
    let qb = new QueryOptionsBuilder()
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('BPMNNode.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(!!filter.fromActivityId, {
        fromActivityId: filter.fromActivityId,
      })
      .filterIf(!!filter.toActivityId, { toActivityId: filter.toActivityId });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        'fromActivityId',
        'toActivityId',
        'autoIterate',
        'conditionFailedActionRunnerId',
        'referralTypeId',
        'roleId',
        'userId',
        'injectForm',
        'name',
        'description',
        'eventCall',
      ])
      .include([
        {
          model: BPMNActivity,
          as: 'fromActivity',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNActivity,
          as: 'toActivity',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNReferralType,
          as: 'referralType',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: BPMNAction,
          as: 'conditionFailedActionRunner',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'roleName'],
          required: false,
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstname', 'lastname'],
          required: false,
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'fromActivityId',
          'toActivityId',
          'autoIterate',
          'conditionFailedActionRunnerId',
          'referralTypeId',
          'roleId',
          'userId',
          'injectForm',
          'name',
          'description',
          'eventCall',
        ])
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('BPMNNode.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: BPMNActivity,
            as: 'fromActivity',
            attributes: ['id', 'name'],
          },
          { model: BPMNActivity, as: 'toActivity', attributes: ['id', 'name'] },
          {
            model: BPMNReferralType,
            as: 'referralType',
            attributes: ['id', 'name'],
          },
          {
            model: BPMNAction,
            as: 'conditionFailedActionRunner',
            attributes: ['id', 'name'],
          },
          { model: Role, as: 'role', attributes: ['id', 'roleName'] },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstname', 'lastname'],
          },
        ])
        .build(),
    );

    if (!item) throw new NotFoundException('bpmn.node_not_found');
    return { result: item };
  }

  async create(dto: CreateNodeDto) {
    const created = await this.repository.create({ ...dto });
    return { result: created };
  }

  async update(id: number, dto: UpdateNodeDto) {
    const item = await this.repository.findByPk(id);
    if (!item || item.isDeleted === true) {
      throw new NotFoundException('bpmn.node_not_found');
    }
    await item.update({ ...dto });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findByPk(id);
    if (!item || item.isDeleted === true) {
      throw new NotFoundException('bpmn.node_not_found');
    }
    await item.update({ isDeleted: true });
    return { ok: true };
  }
}
