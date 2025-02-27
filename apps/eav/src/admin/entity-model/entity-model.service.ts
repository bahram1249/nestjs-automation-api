import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GetEntityModelDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVEntityModel } from '@rahino/localdatabase/models';

@Injectable()
export class EntityModelService {
  constructor(
    @InjectModel(EAVEntityModel)
    private readonly repository: typeof EAVEntityModel,
  ) {}

  async findAll(filter: GetEntityModelDto) {
    let builder = new QueryOptionsBuilder().filter({
      name: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(builder.build());
    builder = builder
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging);
    const options = builder.build();
    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }
}
