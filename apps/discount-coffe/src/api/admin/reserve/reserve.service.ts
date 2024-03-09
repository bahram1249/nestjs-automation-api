import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { User } from '@rahino/database/models/core/user.entity';
import * as _ from 'lodash';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { BuffetReserveType } from '@rahino/database/models/discount-coffe/buffet-reserve-type.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';
import { BuffetReserveDetail } from '@rahino/database/models/discount-coffe/buffet-reserve-detail.entity';
import { BuffetMenu } from '@rahino/database/models/discount-coffe/buffet-menu.entity';
import { ReserveFilterDto } from './dto';

@Injectable()
export class ReserveService {
  constructor(
    @InjectModel(BuffetReserve)
    private readonly repository: typeof BuffetReserve,
  ) {}

  async findAll(user: User, filter: ReserveFilterDto) {
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
        {
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
      ])
      .subQuery(false)
      .filter({ reserveStatusId: reserveComplete })
      .filter({
        '$[user.phoneNumber]$': {
          [Op.like]: filter.search,
        },
      })
      .filter({ '$[buffet.ownerId]$': user.id });
    if (filter.reserveId) {
      builder = builder.filter({ id: filter.reserveId });
    }
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
          attributes: ['id', 'title', 'buffetAddress', 'ownerId'],
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

    return {
      result: await this.repository.findAll(options),
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
