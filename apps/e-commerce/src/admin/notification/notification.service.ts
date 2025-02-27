import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { ECNotification } from '@rahino/localdatabase/models';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(ECNotification) private repository: typeof ECNotification,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll(filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECNotification.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );
    const count = await this.repository.count(queryBuilder.build());
    const result = await this.repository.findAll(
      queryBuilder
        .offset(filter.offset)
        .limit(filter.limit)
        .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy })
        .build(),
    );
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: bigint) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECNotification.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ id: entityId });
    const notification = await this.repository.findOne(queryBuilder.build());
    if (!notification) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: notification,
    };
  }

  async create(dto: NotificationDto, user: User) {
    const mappedItem = this.mapper.map(dto, NotificationDto, ECNotification);
    const insertItem = _.omit(mappedItem.toJSON(), ['id']);
    insertItem.userId = user.id;
    const result = await this.repository.create(insertItem);

    return {
      result: _.pick(result, ['id', 'message', 'createdAt', 'updatedAt']),
    };
  }

  async update(entityId: bigint, dto: NotificationDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECNotification.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    const mappedItem = this.mapper.map(dto, NotificationDto, ECNotification);
    const result = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: {
          id: entityId,
        },
        returning: true,
      },
    );
    return {
      result: _.pick(result[1][0], ['id', 'message', 'createdAt', 'updatedAt']),
    };
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECNotification.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, ['id', 'message', 'createdAt', 'updatedAt']),
    };
  }
}
