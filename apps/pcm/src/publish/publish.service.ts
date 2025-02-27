import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op } from 'sequelize';
import { PublishGetDto } from './dto';
import { PCMPublish } from '@rahino/localdatabase/models';

@Injectable()
export class PublishService {
  constructor(
    @InjectModel(PCMPublish)
    private readonly repository: typeof PCMPublish,
  ) {}

  async findAll(filter: PublishGetDto) {
    let options = QueryFilter.init();
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);
    options.where = {
      [Op.and]: [
        {
          publishName: {
            [Op.like]: filter.search,
          },
        },
      ],
    };
    return {
      result: await this.repository.findAll(options),
      total: await this.repository.count(options),
    };
  }

  async findById(id: number) {
    const publish = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!publish) throw new NotFoundException();
    return {
      result: publish,
    };
  }
}
