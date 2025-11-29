import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { Buffet } from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { HolidayDto } from './dto';
import { User } from '@rahino/database';
import * as _ from 'lodash';
import { BuffetIgnoreReserve } from '@rahino/localdatabase/models';
import { PersianDate } from '@rahino/database';

@Injectable()
export class HolidayService {
  constructor(
    @InjectModel(BuffetIgnoreReserve)
    private readonly repository: typeof BuffetIgnoreReserve,
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
    @InjectModel(PersianDate)
    private readonly persianDateRepository: typeof PersianDate,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    const buffet = await this.buffetRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ ownerId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Buffet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!buffet) {
      throw new BadRequestException('buffet not founded');
    }
    let builder = new QueryOptionsBuilder();
    builder = builder.filter({
      buffetId: buffet.id,
    });
    const count = await this.repository.count(builder.build());
    const options = builder
      .include([
        {
          attributes: ['id', 'title'],
          model: Buffet,
          as: 'buffet',
          required: false,
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();

    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async create(user: User, dto: HolidayDto) {
    const buffet = await this.buffetRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ ownerId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Buffet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!buffet) {
      throw new BadRequestException('buffet not founded');
    }

    const increase = 14;
    const reserveDate = await this.persianDateRepository.findOne({
      where: {
        [Op.and]: [
          {
            YearMonthDay: dto.ignoreDate,
          },
          Sequelize.where(Sequelize.col('GregorianDate'), {
            [Op.lte]: Sequelize.fn(
              'dateadd',
              Sequelize.literal('day'),
              increase,
              Sequelize.fn('getdate'),
            ),
          }),
        ],
      },
    });
    if (!reserveDate) {
      throw new BadRequestException('The Given Date not valid.');
    }
    const ignoreReserve = await this.repository.create({
      buffetId: buffet.id,
      ignoreDate: Sequelize.cast(reserveDate.GregorianDate, 'date'),
    });

    return {
      result: ignoreReserve,
    };
  }

  async remove(user: User, entityId: bigint) {
    const buffet = await this.buffetRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ ownerId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('Buffet.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!buffet) {
      throw new BadRequestException('buffet not founded');
    }

    const ignoreReserve = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ buffetId: buffet.id })
        .filter({ id: entityId })
        .build(),
    );

    if (!ignoreReserve) {
      throw new ForbiddenException('not founded!');
    }
    ignoreReserve.destroy();
    return {
      result: ignoreReserve,
    };
  }
}
