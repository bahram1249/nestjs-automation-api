import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op } from 'sequelize';
import { GetAttributeTypeDto } from './dto';
import { EAVAttributeType } from '@rahino/localdatabase/models';

@Injectable()
export class AttributeTypeService {
  constructor(
    @InjectModel(EAVAttributeType)
    private readonly repository: typeof EAVAttributeType,
  ) {}

  async findAll(filter: GetAttributeTypeDto) {
    let options = QueryFilter.init();
    options.where = {
      [Op.and]: [
        {
          name: {
            [Op.like]: filter.search,
          },
        },
      ],
    };
    const count = await this.repository.count(options);

    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);

    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    const attributeType = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!attributeType) throw new NotFoundException();
    return {
      result: attributeType,
    };
  }
}
