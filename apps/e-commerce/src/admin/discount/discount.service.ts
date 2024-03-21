import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiscountDto, DiscountDto, GetDiscountDto } from './dto';
import { ECDiscount } from '@rahino/database/models/ecommerce-eav/ec-discount.entity';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { ECDiscountType } from '@rahino/database/models/ecommerce-eav/ec-discount-type.entity';
import { ECDiscountActionRule } from '@rahino/database/models/ecommerce-eav/ec-discount-action-rule.entity';
import { ECDiscountActionType } from '@rahino/database/models/ecommerce-eav/ec-discount-action-type.entity';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import * as _ from 'lodash';
import { User } from '@rahino/database/models/core/user.entity';
import { UserVendorService } from '@rahino/ecommerce/user/vendor/user-vendor.service';
import { ECDiscountCondition } from '@rahino/database/models/ecommerce-eav/ec-discount-condition.entity';
import { DiscountConditionTypeEnum } from '../discount-condition-type/enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectModel(ECDiscount)
    private readonly repository: typeof ECDiscount,
    @InjectModel(ECDiscountType)
    private readonly discountTypeRepository: typeof ECDiscountType,
    @InjectModel(ECDiscountCondition)
    private readonly discountConditionRepository: typeof ECDiscountCondition,
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly userVendorService: UserVendorService,
  ) {}

  async findAll(user: User, filter: GetDiscountDto) {
    const vendorIdsStringify = await this.retrunVendorIdsAsString(user);
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
        Sequelize.literal(` EXISTS (
        SELECT 1
        FROM ECDiscountConditions Basetbl
        WHERE Basetbl.discountId = ECDiscount.id
          AND Basetbl.conditionTypeId = ${DiscountConditionTypeEnum.vendor}
          AND Basetbl.conditionValue IN (${vendorIdsStringify})
          AND ISNULL(Basetbl.isDeleted, 0) = 0
      )`),
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

  async findById(entityId: bigint, user: User, transaction?: Transaction) {
    const vendorIdsStringify = await this.retrunVendorIdsAsString(user);
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
      )
      .filter(
        Sequelize.literal(` EXISTS (
        SELECT 1
        FROM ECDiscountConditions Basetbl
        WHERE Basetbl.discountId = ECDiscount.id
          AND Basetbl.conditionTypeId = ${DiscountConditionTypeEnum.vendor}
          AND Basetbl.conditionValue IN (${vendorIdsStringify})
          AND ISNULL(Basetbl.isDeleted, 0) = 0
      )`),
      );
    return {
      result: await this.repository.findOne(queryBuilder.build()),
    };
  }

  async create(user: User, dto: CreateDiscountDto) {
    const { error } = await this.validation(dto);
    if (error) {
      throw new BadRequestException(error);
    }
    const isAccessToVendor = await this.userVendorService.isAccessToVendor(
      user,
      dto.vendorId,
    );
    if (!isAccessToVendor) {
      throw new BadRequestException("You don't have access to this vendor");
    }

    const mappedItem = this.mapper.map(dto, DiscountDto, ECDiscount);
    const insertItem = _.omit(mappedItem.toJSON(), ['id']);
    insertItem.userId = user.id;

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    let discountId: bigint = null;
    try {
      const discount = await this.repository.create(insertItem, {
        transaction: transaction,
      });
      discountId = discount.id;

      // add default condition
      const discountCondition = await this.discountConditionRepository.create(
        {
          conditionTypeId: DiscountConditionTypeEnum.vendor,
          discountId: discount.id,
          conditionValue: dto.vendorId,
          isDefault: true,
        },
        {
          transaction: transaction,
        },
      );
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

  async update(entityId: bigint, dto: DiscountDto, user: User) {
    const vendorIdsStringify = await this.retrunVendorIdsAsString(user);
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
      )
      .filter(
        Sequelize.literal(` EXISTS (
        SELECT 1
        FROM ECDiscountConditions Basetbl
        WHERE Basetbl.discountId = ECDiscount.id
          AND Basetbl.conditionTypeId = ${DiscountConditionTypeEnum.vendor}
          AND Basetbl.conditionValue IN (${vendorIdsStringify})
      )`),
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
    const findItem = await this.findById(entityId, user);
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

  private async retrunVendorIdsAsString(user: User) {
    const vendorIds = await this.userVendorService.findVendorIds(user);
    const vendorIdsString = vendorIds.map((item) => item.toString());
    let vendorIdsStringify = vendorIdsString.join(', ');
    return vendorIdsStringify != '' ? vendorIdsStringify : 'NULL';
  }
}
