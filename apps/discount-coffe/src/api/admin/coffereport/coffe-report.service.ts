import { Injectable } from '@nestjs/common';
import { ListFilter } from '@rahino/query-filter';
import { User } from '@rahino/database';
import * as _ from 'lodash';
import { VW_BuffetReservers } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class CoffeReportService {
  constructor(
    @InjectModel(VW_BuffetReservers)
    private readonly vwBuffetReserversRepository: typeof VW_BuffetReservers,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async totalReserves(user: User, filter: ListFilter) {
    const totalReserves = await this.vwBuffetReserversRepository.findAll({
      attributes: [
        'YearNumber',
        'MonthNumber',
        'PersianMonthName',
        'MinDate',
        'MaxDate',
        [this.seqHelp.sumColumn('totalCnt'), 'totalCnt'],
        [this.seqHelp.sumColumn('onlineCnt'), 'onlineCnt'],
        [this.seqHelp.sumColumn('offlineCnt'), 'offlineCnt'],
        [this.seqHelp.sumColumn('onlineSumPrice'), 'onlineSumPrice'],
      ],
      where: {
        ownerId: user.id,
      },
      group: [
        'YearNumber',
        'MonthNumber',
        'PersianMonthName',
        'MinDate',
        'MaxDate',
      ],
      order: [
        ['YearNumber', 'ASC'],
        ['MonthNumber', 'ASC'],
      ],
    });
    return {
      result: totalReserves,
    };
  }
}
