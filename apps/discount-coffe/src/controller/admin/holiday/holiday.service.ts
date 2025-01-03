import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PersianDate } from '@rahino/database';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class HolidayService {
  constructor(
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
  ) {}

  async create() {
    const convertDateFormat = 103;
    const increase = 14;
    const today = await this.persianDateRepository.findOne({
      where: Sequelize.where(Sequelize.col('GregorianDate'), {
        [Op.eq]: Sequelize.fn(
          'convert',
          Sequelize.literal('date'),
          Sequelize.fn('getdate'),
          convertDateFormat,
        ),
      }),
    });
    const endDate = await this.persianDateRepository.findOne({
      where: Sequelize.where(Sequelize.col('GregorianDate'), {
        [Op.eq]: Sequelize.fn(
          'convert',
          Sequelize.literal('date'),
          Sequelize.fn(
            'dateadd',
            Sequelize.literal('day'),
            increase,
            Sequelize.fn('getdate'),
          ),
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
