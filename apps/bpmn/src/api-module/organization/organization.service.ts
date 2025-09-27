import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNOrganization } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { ListFilter } from '@rahino/query-filter';
import { Op } from 'sequelize';

@Injectable()
export class OrganizationApiService {
  constructor(
    @InjectModel(BPMNOrganization)
    private readonly repository: typeof BPMNOrganization,
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
      .attributes(['id', 'name'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qb.build());
    return { result, total };
  }

  async lookup(filter: ListFilter) {
    let qb = new QueryOptionsBuilder()
      .attributes(['id', 'name'])
      .filterIf(!!filter.search && filter.search !== '%%', {
        name: { [Op.like]: filter.search },
      })
      .limit(filter.limit ?? 20)
      .offset(filter.offset ?? 0)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(qb.build());
    return { result };
  }
}
