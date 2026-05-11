import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { Op, Sequelize } from 'sequelize';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class HolidayService {
  constructor(
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async create() {
    const convertDateFormat = 103;
    const increase = 14;
    const today = await this.persianDateRepository.findOne({
      where: Sequelize.where(Sequelize.col('GregorianDate'), {
        [Op.eq]: Sequelize.fn(
          'convert',
          Sequelize.literal('date'),
          this.seqHelp.getDate(),
          convertDateFormat,
        ),
      }),
    });
    const endDate = await this.persianDateRepository.findOne({
      where: Sequelize.where(Sequelize.col('GregorianDate'), {
        [Op.eq]: Sequelize.fn(
          'convert',
          Sequelize.literal('date'),
          this.seqHelp.dateAdd(increase, 'day'),
          convertDateFormat,
        ),
      }),
    });
    return {
      today: JSON.parse(JSON.stringify(today)),
      endDate: JSON.parse(JSON.stringify(endDate)),
      title: 'ایجاد تعطیلی جدید',
      layout: false,
    };
  }
}
