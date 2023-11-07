import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from 'apps/core/src/util/core/mapper/query-filter.mapper';
import { Op } from 'sequelize';
import { PeriodTypeGetDto } from './dto';
import { PCMPeriodType } from 'apps/core/src/database/sequelize/models/pcm/pcm-period-type.entity';

@Injectable()
export class PeriodTypeService {
  constructor(
    @InjectModel(PCMPeriodType)
    private readonly repository: typeof PCMPeriodType,
  ) {}

  async findAll(filter: PeriodTypeGetDto) {
    let options = QueryFilter.init();
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);
    options.where = {
      [Op.and]: [
        {
          periodTypeName: {
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
    const periodType = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!periodType) throw new NotFoundException();
    return {
      result: periodType,
    };
  }
}
