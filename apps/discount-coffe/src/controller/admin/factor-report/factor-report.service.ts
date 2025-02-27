import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from '@rahino/database';
import { User } from '@rahino/database';
import { Buffet } from '@rahino/localdatabase/models';
import { VW_BuffetReservers } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Request } from 'express';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class FactorReportService {
  constructor(
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
    @InjectModel(VW_BuffetReservers)
    private readonly buffetReservesRepository: typeof VW_BuffetReservers,
  ) {}
  async factorReport(req: Request, user: User, menus: Menu[]) {
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
      throw new BadRequestException('you dont have a buffet');
    }
    const reports = await this.buffetReservesRepository.findAll(
      new QueryOptionsBuilder().filter({ ownerId: user.id }).build(),
    );
    return {
      title: 'صورت حساب',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
      reports: JSON.parse(JSON.stringify(reports)),
    };
  }
}
