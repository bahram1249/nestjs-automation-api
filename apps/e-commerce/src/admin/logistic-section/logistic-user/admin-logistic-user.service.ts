import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLogisticUserDto, GetLogisticUserDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECLogistic, ECLogisticUser } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LogisticUserRoleHandlerService } from '../logistic-user-role-handler/logistic-user-role-handler.service';

@Injectable()
export class AdminLogisticUserService {
  constructor(
    @InjectModel(ECLogisticUser)
    private readonly repository: typeof ECLogisticUser,

    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly localizationService: LocalizationService,
    private readonly logisticUserRoleHandlerService: LogisticUserRoleHandlerService,
  ) {}

  async findAll(logisticId: bigint, filter: GetLogisticUserDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .include([
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
          required: true,
        },
      ])
      .filter({
        [Op.or]: [
          {
            '$user.firstname$': {
              [Op.like]: filter.search,
            },
          },
          {
            '$user.lastname$': {
              [Op.like]: filter.search,
            },
          },
          {
            '$user.phoneNumber$': {
              [Op.like]: filter.search,
            },
          },
        ],
      })
      .filter({ logisticId: logisticId })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECLogisticUser.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes(['id', 'userId', 'logisticId'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async create(user: User, dto: CreateLogisticUserDto) {
    await this.logisticUserRoleHandlerService.addUserToLogistic({
      logisticId: dto.logisticId,
      user: dto,
      isDefault: false,
    });
    return {
      result: this.localizationService.translate('core.success'),
    };
  }

  async deleteById(entityId: bigint) {
    // find item
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .include([{ model: User, as: 'user' }])
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    await this.logisticUserRoleHandlerService.removeUserFromLogistic({
      logisticId: item.logisticId,
      user: item.user,
    });

    return {
      result: this.localizationService.translate('core.success'),
    };
  }
}
