import { Injectable } from '@nestjs/common';
import { ListFilter } from '@rahino/query-filter';
import { User } from '@rahino/database/models/core/user.entity';
import * as _ from 'lodash';
import { VW_BuffetReservers } from '@rahino/database/models/discount-coffe/vw_buffet_reserve.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class CoffeReportService {
  constructor(
    @InjectModel(VW_BuffetReservers)
    private readonly vwBuffetReserversRepository: typeof VW_BuffetReservers,
  ) {}

  async totalReserves(user: User, filter: ListFilter) {
    const totalReserves = await this.vwBuffetReserversRepository.findAll({
      attributes: [
        'YearNumber',
        'MonthNumber',
        'PersianMonthName',
        'MinDate',
        'MaxDate',
        [Sequelize.fn('sum', Sequelize.col('totalCnt')), 'totalCnt'],
        [Sequelize.fn('sum', Sequelize.col('onlineCnt')), 'onlineCnt'],
        [Sequelize.fn('sum', Sequelize.col('offlineCnt')), 'offlineCnt'],
        [
          Sequelize.fn('sum', Sequelize.col('onlineSumPrice')),
          'onlineSumPrice',
        ],
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
