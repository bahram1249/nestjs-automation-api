import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { AllFactorReportDto } from './dto';
import { VW_BuffetReservers } from '@rahino/localdatabase/models';

@Injectable()
export class AllFactorReportService {
  constructor(
    @InjectModel(VW_BuffetReservers)
    private readonly repository: typeof VW_BuffetReservers,
  ) {}

  async findAll(filter: AllFactorReportDto) {
    const queryBuilder = new QueryOptionsBuilder().filter({
      id: filter.buffetId,
    });
    const count = await this.repository.count(queryBuilder.build());
    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }
}
