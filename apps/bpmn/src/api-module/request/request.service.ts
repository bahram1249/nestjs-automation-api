import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  BPMNRequest,
  BPMNPROCESS,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GetRequestDto } from './dto/get-request.dto';
import { User } from '@rahino/database';

@Injectable()
export class RequestCrudService {
  constructor(
    @InjectModel(BPMNRequest)
    private readonly repository: typeof BPMNRequest,
  ) {}

  async findAll(filter: GetRequestDto) {
    let qb = new QueryOptionsBuilder()
      .filterIf(!!filter.userId, { userId: filter.userId })
      .filterIf(!!filter.processId, { processId: filter.processId })
      .filterIf(!!filter.organizationId, {
        organizationId: filter.organizationId,
      });

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes(['id', 'userId', 'processId', 'organizationId'])
      .include([
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
        .attributes(['id', 'userId', 'processId', 'organizationId'])
        .include([
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
        ])
        .filter({ id: id })
        .build(),
    );

    if (!item) throw new NotFoundException('bpmn.request_not_found');
    return { result: item };
  }

  async lookup(filter: GetRequestDto) {
    // Count with base filters (no pagination)
    const qbBase = new QueryOptionsBuilder()
      .filterIf(!!filter.userId, { userId: filter.userId })
      .filterIf(!!filter.processId, { processId: filter.processId })
      .filterIf(!!filter.organizationId, {
        organizationId: filter.organizationId,
      });
    const total = await this.repository.count(qbBase.build());

    // List with attributes, includes and pagination
    const qbList = new QueryOptionsBuilder()
      .attributes(['id', 'userId', 'processId', 'organizationId'])
      .filterIf(!!filter.userId, { userId: filter.userId })
      .filterIf(!!filter.processId, { processId: filter.processId })
      .filterIf(!!filter.organizationId, {
        organizationId: filter.organizationId,
      })
      .include([
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
      ])
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qbList.build());
    return { result, total };
  }

  async update(
    id: number,
    dto: Partial<{
      userId: number;
      processId: number;
      organizationId?: number;
    }>,
  ) {
    const item = await this.repository.findByPk(id);
    if (!item) throw new NotFoundException('bpmn.request_not_found');
    await item.update(JSON.parse(JSON.stringify(dto)), {
      where: {
        id: id,
      },
    });

    return { result: item };
  }

  async deleteById(id: number) {
    const item = await this.repository.findByPk(id);
    if (!item) throw new NotFoundException('bpmn.request_not_found');
    await item.destroy();
    return { ok: true };
  }
}
