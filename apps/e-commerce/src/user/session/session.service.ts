import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECUserSession } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as randomstring from 'randomstring';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';
import * as _ from 'lodash';

@Injectable()
export class SessionService {
  constructor(
    @InjectModel(ECUserSession)
    private readonly userSessionRepository: typeof ECUserSession,
    private readonly config: ConfigService,
    private readonly seqHelp: SequelizeHelpService,
  ) {}
  async getSession(user?: User) {
    let session: ECUserSession = null;
    if (user) {
      session = await this.userSessionRepository.findOne(
        new QueryOptionsBuilder()
          .filter(
            this.seqHelp.whereIsNullColumnEqualToZero(
              'ECUserSession.isDeleted',
              0,
            ),
          )
          .filter({
            userId: user.id,
          })
          .filter(this.seqHelp.whereCurrentDateLessThanColumn('expireAt'))
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
            this.seqHelp.whereIsNullColumnEqualToZero(
              'ECUserSession.isDeleted',
              0,
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
      expireAt: this.seqHelp.dateAdd(sessionLimitDay, 'day'),
    });
    return session;
  }
}
