import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNNodeCommandType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ListFilter } from '@rahino/query-filter';
import { Op } from 'sequelize';

@Injectable()
export class NodeCommandTypeService {
  constructor(
    @InjectModel(BPMNNodeCommandType)
    private readonly repository: typeof BPMNNodeCommandType,
  ) {}

  async findAll(filter: ListFilter) {
    let qb = new QueryOptionsBuilder().filterIf(
      !!filter.search && filter.search !== '%%',
      {
        name: { [Op.like]: filter.search },
      },
    );

    const total = await this.repository.count(qb.build());

    qb = qb
      .attributes(['id', 'name', 'commandColor'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async lookup(filter: ListFilter) {
    const qbBase = new QueryOptionsBuilder().filterIf(
      !!filter.search && filter.search !== '%%',
      {
        name: { [Op.like]: filter.search },
      },
    );
    const total = await this.repository.count(qbBase.build());

    const qbList = new QueryOptionsBuilder()
      .attributes(['id', 'name', 'commandColor'])
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search },
      })
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qbList.build());
    return { result, total };
  }

  async findById(id: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().attributes(['id', 'name', 'commandColor']).filter({ id }).build(),
    );
    return { result: item };
  }
}
