import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as moment from 'moment-jalaali';

@Injectable()
export class PersianDateMonthService {
  constructor(
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
  ) {}

  async lastDays() {
    const lastDays = await this.persianDateRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          GregorianDate: {
            [Op.lte]: moment()
              .tz('Asia/Tehran', false)
              .locale('en')
              .format('YYYY-MM-DD HH:mm:ss'),
          },
        })
        .attributes([
          [
            Sequelize.fn('MAX', Sequelize.col('GregorianDate')),
            'gregorianDate',
          ],
          'yearMonth',
          'persianMonthName',
        ])
        .order({ orderBy: 'yearMonth', sortOrder: 'DESC' })
        .offset(0)
        .limit(24)
        .group(['PersianDate.YearMonth', 'PersianDate.PersianMonthName'])
        .build(),
    );
    return {
      result: lastDays,
    };
  }

  async firstDays() {
    const firstDays = await this.persianDateRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          GregorianDate: {
            [Op.lte]: moment()
              .tz('Asia/Tehran', false)
              .locale('en')
              .format('YYYY-MM-DD HH:mm:ss'),
          },
        })
        .attributes([
          [
            Sequelize.fn('MIN', Sequelize.col('GregorianDate')),
            'gregorianDate',
          ],
          'yearMonth',
          'persianMonthName',
        ])
        .order({ orderBy: 'yearMonth', sortOrder: 'DESC' })
        .offset(0)
        .limit(24)
        .group(['PersianDate.YearMonth', 'PersianDate.PersianMonthName'])
        .build(),
    );
    return {
      result: firstDays,
    };
  }
}
