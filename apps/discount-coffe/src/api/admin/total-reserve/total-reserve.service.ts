import { Injectable, NotImplementedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { User } from '@rahino/database/models/core/user.entity';
import * as _ from 'lodash';
import { BuffetReserve } from '@rahino/database/models/discount-coffe/buffet-reserve.entity';
import { BuffetReserveType } from '@rahino/database/models/discount-coffe/buffet-reserve-type.entity';
import { Buffet } from '@rahino/database/models/discount-coffe/buffet.entity';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { PersianDate } from '@rahino/database/models/core/view/persiandate.entity';

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
          model: User,
          as: 'user',
        },
      ])
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
          model: User,
          as: 'user',
        },
        {
          model: BuffetReserveType,
          as: 'reserveType',
          required: false,
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
        {
          model: PersianDate,
          as: 'persianDate',
          on: Sequelize.literal(
            'convert(date, [BuffetReserve].[reserveDate], 103) = [persianDate].[GregorianDate]',
          ),
        },
      ])
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
