import { Injectable, Query } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';
import * as moment from 'moment-jalaali';

@Injectable()
export class PersianDateMonthService {
  constructor(
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    private readonly seqHelp: SequelizeHelpService,
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
            this.seqHelp.maxColumn('GregorianDate'),
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
            this.seqHelp.minColumn('GregorianDate'),
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
