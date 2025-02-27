import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { User } from '@rahino/database';
import * as _ from 'lodash';
import { BuffetReserve } from '@rahino/localdatabase/models';
import { BuffetReserveType } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { PersianDate } from '@rahino/database';
import { BuffetReserveDetail } from '@rahino/localdatabase/models';
import { BuffetMenu } from '@rahino/localdatabase/models';

@Injectable()
export class TotalReserveService {
  constructor(
    @InjectModel(BuffetReserve)
    private readonly repository: typeof BuffetReserve,
  ) {}

  async findAll(filter: ListFilter) {
    let builder = new QueryOptionsBuilder();
    const reserveComplete = 2;
    builder = builder
      .include([
        {
          attributes: [
            'id',
            'firstname',
            'lastname',
            'username',
            'phoneNumber',
          ],
          model: User,
          as: 'user',
        },
      ])
      .subQuery(false)
      .filter({ reserveStatusId: reserveComplete })
      .filter({
        '$user.phoneNumber$': {
          [Op.like]: filter.search,
        },
      });
    const count = await this.repository.count(builder.build());
    const options = builder
      .include([
        {
          attributes: [
            'id',
            'firstname',
            'lastname',
            'username',
            'phoneNumber',
          ],
          model: User,
          as: 'user',
        },
        {
          model: BuffetReserveType,
          as: 'reserveType',
          required: false,
        },
        {
          attributes: ['id', 'title', 'buffetAddress'],
          model: Buffet,
          as: 'buffet',
          include: [
            {
              model: Attachment,
              as: 'coverAttachment',
              required: false,
            },
          ],
        },
        {
          model: PersianDate,
          as: 'persianDate',
          on: Sequelize.literal(
            'convert(date, [BuffetReserve].[reserveDate], 103) = [persianDate].[GregorianDate]',
          ),
        },
        {
          model: BuffetReserveDetail,
          as: 'details',
          required: false,
          include: [
            {
              model: BuffetMenu,
              as: 'buffetMenu',
              include: [
                {
                  model: Attachment,
                  as: 'cover',
                  required: false,
                },
              ],
            },
          ],
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();

    const result = await this.repository.findAll(options);
    return {
      result: result,
      total: count,
    };
  }

  async edit(id: bigint, user: User) {
    throw new NotImplementedException();
  }

  async findById(entityId: bigint) {
    throw new NotImplementedException();
  }
}
