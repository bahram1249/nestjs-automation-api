import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  BPMNRequest,
  BPMNRequestState,
  BPMNActivity,
  BPMNPROCESS,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GetRequestStateDto } from './dto/get-request-state.dto';
import { Role, User } from '@rahino/database';

@Injectable()
export class RequestStateCrudService {
  constructor(
    @InjectModel(BPMNRequestState)
    private readonly repository: typeof BPMNRequestState,
  ) {}

  async findAll(filter: GetRequestStateDto) {
    let qb = new QueryOptionsBuilder()
      .filterIf(!!filter.requestId, { requestId: filter.requestId })
      .filterIf(!!filter.activityId, { activityId: filter.activityId })
      .filterIf(!!filter.userId, { userId: filter.userId })
      .filterIf(!!filter.roleId, { roleId: filter.roleId })
      .filterIf(!!filter.organizationId, {
        organizationId: filter.organizationId,
      });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes([
        'id',
        'requestId',
        'activityId',
        'userId',
        'roleId',
        'organizationId',
        'returnRequestStateId',
      ])
      .include([
        {
          model: BPMNRequest,
          as: 'request',
          attributes: ['id', 'userId', 'processId', 'organizationId'],
          required: false,
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'username', 'firstname', 'lastname'],
              required: false,
            },
            {
              model: BPMNPROCESS,
              as: 'process',
              attributes: ['id', 'name'],
              required: false,
            },
            {
              model: BPMNOrganization,
              as: 'organization',
              attributes: ['id', 'name'],
              required: false,
            },
          ],
        },
        {
          model: BPMNActivity,
          as: 'activity',
          attributes: ['id', 'name'],
          required: false,
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'firstname', 'lastname'],
          required: false,
        },
        {
          model: Role,
          as: 'role',
          attributes: ['id', 'roleName'],
          required: false,
        },
        {
          model: BPMNOrganization,
          as: 'organization',
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

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'requestId',
          'activityId',
          'userId',
          'roleId',
          'organizationId',
          'returnRequestStateId',
        ])
        .filter({ id: id })
        .include([
          {
            model: BPMNRequest,
            as: 'request',
            attributes: ['id', 'userId', 'processId', 'organizationId'],
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username', 'firstname', 'lastname'],
              },
              { model: BPMNPROCESS, as: 'process', attributes: ['id', 'name'] },
              {
                model: BPMNOrganization,
                as: 'organization',
                attributes: ['id', 'name'],
              },
            ],
          },
          { model: BPMNActivity, as: 'activity', attributes: ['id', 'name'] },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username', 'firstname', 'lastname'],
          },
          { model: Role, as: 'role', attributes: ['id', 'roleName'] },
          {
            model: BPMNOrganization,
            as: 'organization',
            attributes: ['id', 'name'],
          },
        ])
        .build(),
    );

    if (!item) throw new NotFoundException('bpmn.request_state_not_found');
    return { result: item };
  }

  async create(data: Partial<BPMNRequestState>) {
    const created = await this.repository.create(
      JSON.parse(JSON.stringify(data)),
    );
    return { result: created };
  }

  async update(id: number, data: Partial<BPMNRequestState>) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id: id }).build(),
    );
    if (!item) throw new NotFoundException('bpmn.request_state_not_found');
    await item.update(JSON.parse(JSON.stringify(data)), {
      where: {
        id: id,
      },
    });
    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id: id }).build(),
    );
    if (!item) throw new NotFoundException('bpmn.request_state_not_found');
    await item.destroy();
    return { ok: true };
  }
}
