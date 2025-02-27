import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { GetBlogPublishDto } from './dto';
import { EAVBlogPublish } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class BlogPublishService {
  constructor(
    @InjectModel(EAVBlogPublish)
    private readonly repository: typeof EAVBlogPublish,
  ) {}

  async findAll(filter: GetBlogPublishDto) {
    let query = new QueryOptionsBuilder().filter({
      name: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(query.build());
    query = query
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.repository.findAll(query.build()),
      total: count,
    };
  }

  async findById(id: number) {
    const blogPublish = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          id: id,
        })
        .build(),
    );
    if (!blogPublish) throw new NotFoundException();
    return {
      result: blogPublish,
    };
  }
}
