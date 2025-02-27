import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECUserSession } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as randomstring from 'randomstring';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(ECUserSession)
    private readonly userSessionRepository: typeof ECUserSession,
    private readonly config: ConfigService,
  ) {}
  async getSession(user?: User) {
    let session: ECUserSession = null;
    if (user) {
      session = await this.userSessionRepository.findOne(
        new QueryOptionsBuilder()
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECUserSession.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .filter({
            userId: user.id,
          })
          .filter(
            Sequelize.where(Sequelize.fn('getdate'), {
              [Op.lt]: Sequelize.col('expireAt'),
            }),
          )
          .build(),
      );
      if (!session) {
        session = await this.createSession(user);
      }
    } else {
      session = await this.createSession(user);
    }
    return _.pick(session, ['id', 'userId', 'expireAt']);
  }

  private async createSession(user?: User) {
    const sessionLimitDay = parseInt(
      this.config.get<string>('USER_SESSION_LIMIT_DAY'),
    );
    const randomLength = 7;
    let random = randomstring.generate(randomLength);
    while (true) {
      const findItem = await this.userSessionRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: random })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECUserSession.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      if (!findItem) break;
      random = randomstring.generate(randomLength);
    }
    let session: ECUserSession = null;
    const userId = user ? user.id : null;
    session = await this.userSessionRepository.create({
      id: random,
      userId: userId,
      expireAt: Sequelize.fn(
        'dateadd',
        Sequelize.literal('day'),
        sessionLimitDay,
        Sequelize.fn('getdate'),
      ),
    });
    return session;
  }
}
