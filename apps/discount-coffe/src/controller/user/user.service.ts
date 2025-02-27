import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Attachment } from '@rahino/database';
import { User } from '@rahino/database';
import { PersianDate } from '@rahino/database';
import { BuffetReserveStatus } from '@rahino/localdatabase/models';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Request, Response } from 'express';
import { Sequelize } from 'sequelize';
import { UserDto } from './dto';
import * as _ from 'lodash';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(BuffetReserve)
    private readonly buffetReserveRepository: typeof BuffetReserve,
  ) {}

  async reserves(user: User, req: Request, page: number = 1) {
    const completeStatus = 2;
    const limit = 10;

    const queryBuilder = new QueryOptionsBuilder()
      .filter({ userId: user.id })
      .filter({ reserveStatusId: completeStatus });

    const reserveCount = await this.buffetReserveRepository.count(
      queryBuilder.build(),
    );

    const reserves = await this.buffetReserveRepository.findAll(
      queryBuilder
        .include([
          {
            model: BuffetReserveStatus,
            as: 'reserveStatus',
            required: false,
          },
          {
            model: Buffet,
            as: 'buffet',
            required: false,
          },
          {
            model: PersianDate,
            as: 'persianDate',
            on: Sequelize.literal(
              'convert(date, [BuffetReserve].[reserveDate], 103) = [persianDate].[GregorianDate]',
            ),
          },
        ])
        .offset((page - 1) * limit)
        .limit(limit)
        .order({ orderBy: 'id', sortOrder: 'DESC' })
        .build(),
    );

    return {
      title: 'لیست رزرو های شما',
      page: page,
      limit: limit,
      reserveCount: reserveCount,
      reserves: JSON.parse(JSON.stringify(reserves)),
      user: user.toJSON(),
      layout: 'discountcoffe',
    };
  }

  async profile(user: User, req: Request) {
    const currentUser = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'firstname', 'lastname', 'username', 'phoneNumber'])
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'profileAttachment',
            required: false,
          },
        ])
        .filter({ id: user.id })
        .build(),
    );
    return {
      title: 'پروفایل شما',
      currentUser: currentUser.toJSON(),
      user: user.toJSON(),
      layout: 'discountcoffe',
    };
  }

  async updateProfile(user: User, req: Request, dto: UserDto) {
    const updated = await this.userRepository.update(
      _.pick(dto, ['firstname', 'lastname']),
      {
        where: {
          id: user.id,
        },
        returning: true,
      },
    );
    const updatedUser = updated[1][0];
    return {
      title: 'پروفایل شما',
      currentUser: updatedUser.toJSON(),
      user: updatedUser.toJSON(),
      layout: 'discountcoffe',
    };
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('token');
    return res.redirect(302, '/');
  }
}
