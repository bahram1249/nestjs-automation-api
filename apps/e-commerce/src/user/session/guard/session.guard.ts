import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { RedisRepository } from '@rahino/redis-client';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(ECUserSession)
    private readonly userSessionRepository: typeof ECUserSession,
    private readonly redisRepository: RedisRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.headers?.user_session;
    // if session not provided
    if (!session) return false;
    // find user session
    const userId = request.user ? request.user.id : 0;
    const item = await this.redisRepository.isExists(
      `user:${userId}:session`,
      session,
    );
    if (item.exists) {
      return true;
    }

    // basic query for non deleted and non expired session
    let queryBuilder = new QueryOptionsBuilder()
      .filter({ id: session })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECUserSession.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.where(Sequelize.fn('getdate'), {
          [Op.lt]: Sequelize.col('expireAt'),
        }),
      );
    // if user provided
    if (request.user) {
      queryBuilder = queryBuilder.filter({
        [Op.or]: [
          {
            userId: {
              [Op.is]: null,
            },
          },
          {
            userId: request.user.id,
          },
        ],
      });
    } else {
      queryBuilder = queryBuilder.filter({
        userId: {
          [Op.is]: null,
        },
      });
    }

    // find the valid session
    let findSession = await this.userSessionRepository.findOne(
      queryBuilder.build(),
    );
    // if the session is not valid
    if (!findSession) return false;
    // if the session exists but not assign to this user
    if (findSession.userId == null && request.user != null) {
      findSession = await this.userSessionRepository.update(
        { userId: request.user.id },
        { where: { id: session }, returning: true },
      )[1][0];
    }
    // store this session for 300 seconds
    await this.redisRepository.setWithExpiry(
      `user:${userId}:session`,
      session,
      session,
      300,
    );
    return true;
  }
}
