import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DiscountDto, GetDiscountDto } from './dto';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { ECDiscountType } from '@rahino/database/models/ecommerce-eav/ec-discount-type.entity';
import { ECDiscountActionRule } from '@rahino/database/models/ecommerce-eav/ec-discount-action-rule.entity';
import { ECDiscountActionType } from '@rahino/database/models/ecommerce-eav/ec-discount-action-type.entity';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(ECDiscount)
    private readonly repository: typeof ECDiscount,
    @InjectModel(ECDiscountType)
    private readonly discountTypeRepository: typeof ECDiscountType,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetDiscountDto) {
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
      );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes([
        'id',
        'name',
        //'description',
        'discountTypeId',
        'discountActionTypeId',
        'discountValue',
        'maxValue',
        'discountActionRuleId',
        //'userId',
        'couponCode',
        'priority',
        'limit',
        'used',
        'isActive',
        'startDate',
        'endDate',
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

  async findById(entityId: bigint) {
    const queryBuilder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'description',
        'discountTypeId',
        'discountActionTypeId',
        'discountValue',
        'maxValue',
        'discountActionRuleId',
        //'userId',
        'couponCode',
        'priority',
        'limit',
        'used',
        'isActive',
        'startDate',
        'endDate',
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
      );
    return {
      result: await this.repository.findOne(queryBuilder.build()),
    };
  }

  async create(user: User, dto: DiscountDto) {
    const { error } = await this.validation(dto);
    if (error) {
      throw new BadRequestException(error);
    }
    const mappedItem = this.mapper.map(dto, DiscountDto, ECDiscount);
    const insertItem = _.omit(mappedItem.toJSON(), ['id']);
    insertItem.userId = user.id;
    const discount = await this.repository.create(insertItem);
    const findItem = await this.findById(discount.id);
    return {
      result: findItem.result,
    };
  }

  async update(entityId: bigint, dto: DiscountDto) {
    const { error } = await this.validation(dto);
    if (error) {
      throw new BadRequestException(error);
    }
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
      );
    const item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    const mappedItem = this.mapper.map(dto, DiscountDto, ECDiscount);
    const updateItem = _.omit(mappedItem.toJSON(), ['id']);
    await this.repository.update(updateItem, {
      where: {
        id: entityId,
      },
    });
    const findItem = await this.findById(entityId);
    return {
      result: findItem.result,
    };
  }

  async deleteById(entityId: bigint) {
    const queryBuilder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'description',
        'discountTypeId',
        'discountActionTypeId',
        'discountValue',
        'maxValue',
        'discountActionRuleId',
        //'userId',
        'couponCode',
        'priority',
        'limit',
        'used',
        'isActive',
        'startDate',
        'endDate',
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
      );
    let item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    item.isDeleted = false;
    item = await item.save();
    return {
      result: _.pick(item, [
        'id',
        'name',
        'description',
        'discountTypeId',
        'discountActionTypeId',
        'discountValue',
        'maxValue',
        'discountActionRuleId',
        //'userId',
        'couponCode',
        'priority',
        'limit',
        'used',
        'isActive',
        'startDate',
        'endDate',
      ]),
    };
  }

  private async validation(
    dto: DiscountDto,
  ): Promise<{ code: number; error?: string }> {
    const discountType = await this.discountTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.discountActionTypeId })
        .build(),
    );
    if (discountType.isCouponBased == true && dto.couponCode == null) {
      return { code: 400, error: 'Coupon Code is Required' };
    }
    return { code: 200 };
  }
}
