import { Injectable } from '@nestjs/common';
import { GetUserPointDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSPoint, GSUserPoint } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { InjectKnex, Knex } from 'nestjs-knex';

@Injectable()
export class UserPointService {
  // find request

  constructor(
    @InjectModel(GSUserPoint)
    private readonly repository: typeof GSUserPoint,
    @InjectKnex() private readonly knex: Knex,
  ) {}

  async totalScore(user: User) {
    const point = await this.knex('GSUserPoints')
      .select(this.knex.raw('SUM(GSUserPoints.pointScore) as pointScore'))
      .where('GSUserPoints.userId', '=', `${user.id}`)
      .first();

    const score = point['pointScore'] ? point['pointScore'] : 0;

    return {
      result: score,
    };
  }

  async findAll(user: User, filter: GetUserPointDto) {
    // find request
    let query = new QueryOptionsBuilder().filter({ userId: user.id });

    const count = await this.repository.count(query.build());

    query = query
      .include([{ model: GSPoint, as: 'point', attributes: ['id', 'title'] }])
      .attributes([
        'id',
        'pointId',
        'userId',
        'pointScore',
        'createdAt',
        'updatedAt',
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }
}
