import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from '@rahino/database';
import { User } from '@rahino/database';
import { Buffet } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Request } from 'express';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';

@Injectable()
export class AllFactorReportService {
  constructor(
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
  ) {}
  async factorReport(req: Request, user: User, menus: Menu[]) {
    const buffets = await this.buffetRepository.findAll(
      new QueryOptionsBuilder()
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

    return {
      title: 'صورت حساب ها',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
      buffets: JSON.parse(JSON.stringify(buffets)),
    };
  }
}
