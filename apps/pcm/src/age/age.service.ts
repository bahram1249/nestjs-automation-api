import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op } from 'sequelize';
import { AgeGetDto } from './dto';
import { PCMAge } from '@rahino/localdatabase/models';

@Injectable()
export class AgeService {
  constructor(
    @InjectModel(PCMAge)
    private readonly repository: typeof PCMAge,
  ) {}

  async findAll(filter: AgeGetDto) {
    let options = QueryFilter.init();
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);
    options.where = {
      [Op.and]: [
        {
          ageName: {
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
    const age = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!age) throw new NotFoundException();
    return {
      result: age,
    };
  }
}
