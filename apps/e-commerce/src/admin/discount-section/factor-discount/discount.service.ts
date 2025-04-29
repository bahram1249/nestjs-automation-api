import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiscountDto, FactorDiscountDto, GetDiscountDto } from './dto';
import { ECDiscount } from '@rahino/localdatabase/models';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { ECDiscountType } from '@rahino/localdatabase/models';
import { ECDiscountActionRule } from '@rahino/localdatabase/models';
import { ECDiscountActionType } from '@rahino/localdatabase/models';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { DiscountConditionTypeEnum } from '../discount-condition-type/enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(ECDiscount)
    private readonly repository: typeof ECDiscount,
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(user: User, filter: GetDiscountDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscount.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscount.discountTypeId'), 0),
          {
            [Op.eq]: 5,
          },
        ),
      );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes([
        'id',
        'name',
        //'description',
        'discountTypeId',
        //'userId',
        'priority',
        'limit',
        'used',
        'isActive',
        'startDate',
        'endDate',
        'freeShipment',
        'minPrice',
        'maxPrice',
      ])
      .include([
        {
          model: ECDiscountType,
          as: 'discountType',
        },
        {
          model: ECDiscountActionType,
          as: 'actionType',
        },
        {
          model: ECDiscountActionRule,
          as: 'actionRule',
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: bigint, user: User, transaction?: Transaction) {
    const queryBuilder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'description',
        'discountTypeId',
        //'userId',
        'priority',
        'limit',
        'used',
        'isActive',
        'startDate',
        'endDate',
        'freeShipment',
        'minPrice',
        'maxPrice',
      ])
      .include([
        {
          model: ECDiscountType,
          as: 'discountType',
        },
        {
          model: ECDiscountActionType,
          as: 'actionType',
        },
        {
          model: ECDiscountActionRule,
          as: 'actionRule',
        },
      ])
      .filter({
        id: entityId,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscount.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscount.discountTypeId'), 0),
          {
            [Op.eq]: 5,
          },
        ),
      );
    return {
      result: await this.repository.findOne(queryBuilder.build()),
    };
  }

  async create(user: User, dto: CreateDiscountDto) {
    const mappedItem = this.mapper.map(dto, FactorDiscountDto, ECDiscount);
    mappedItem.freeShipment = true;
    mappedItem.discountTypeId = 5;
    mappedItem.userId = user.id;
    const insertItem = _.omit(mappedItem.toJSON(), ['id']);

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    let discountId: bigint = null;
    try {
      const discount = await this.repository.create(insertItem, {
        transaction: transaction,
      });
      discountId = discount.id;

      transaction.commit();
    } catch {
      transaction.rollback();
      throw new InternalServerErrorException('discount transaction failed');
    }

    const findItem = await this.findById(discountId, user);
    return {
      result: findItem.result,
    };
  }

  async update(entityId: bigint, dto: FactorDiscountDto, user: User) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        id: entityId,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscount.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscount.discountTypeId'), 0),
          {
            [Op.eq]: 5,
          },
        ),
      );

    const item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    const mappedItem = this.mapper.map(dto, FactorDiscountDto, ECDiscount);
    mappedItem.freeShipment = true;
    mappedItem.discountTypeId = 5;
    const updateItem = _.omit(mappedItem.toJSON(), ['id']);
    await this.repository.update(updateItem, {
      where: {
        id: entityId,
      },
    });
    const findItem = await this.findById(entityId, user);
    return {
      result: findItem.result,
    };
  }

  async deleteById(entityId: bigint) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        id: entityId,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscount.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECDiscount.discountTypeId'), 0),
          {
            [Op.eq]: 5,
          },
        ),
      );
    let item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    item.isDeleted = true;
    item = await item.save();
    return {
      result: _.pick(item, [
        'id',
        'name',
        'description',
        'discountTypeId',
        //'userId',
        'priority',
        'limit',
        'used',
        'isActive',
        'startDate',
        'endDate',
        'freeShipment',
      ]),
    };
  }
}
