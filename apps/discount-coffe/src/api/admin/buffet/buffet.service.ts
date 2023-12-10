import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Attachment } from '@rahino/database/models/core/attachment.entity';

@Injectable()
export class BuffetService {
  constructor(
    @InjectModel(Buffet)
    private readonly repository: typeof Buffet,
  ) {}

  async findAll(filter: ListFilter) {
    let builder = new QueryOptionsBuilder();
    builder = builder.filter({
      ageName: {
        [Op.like]: filter.search,
      },
    });
    const count = await this.repository.findOne(builder.build());
    const options = builder
      .include([
        {
          model: Attachment,
          as: 'coverAttachment',
          required: false,
        },
      ])
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();

    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    throw new NotImplementedException();
    // return {
    //   result: age,
    // };
  }
}
