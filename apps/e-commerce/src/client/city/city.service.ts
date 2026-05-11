import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { ECProvince } from '@rahino/localdatabase/models';
import { Op, Sequelize } from 'sequelize';
import { GetCityDto } from './dto';
import { ECCity } from '@rahino/localdatabase/models';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class CityService {
  constructor(
    @InjectModel(ECCity) private repository: typeof ECCity,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(dto: GetCityDto) {
    let queryBuilder = new QueryOptionsBuilder().filter(
      this.seqHelp.whereIsNullColumnEqualToZero('ECCity.isDeleted', 0),
    );
    if (dto.provinceId) {
      queryBuilder = queryBuilder.filter({ provinceId: dto.provinceId });
    }
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes(['id', 'name', 'slug', 'provinceId', 'neighborhoodBase'])
      .include([
        {
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'province',
        },
      ])
      .order({ orderBy: 'order', sortOrder: 'asc' })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }
}
