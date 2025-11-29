import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DiscountConditionDto, GetDiscountConditionDto } from './dto';
import { User } from '@rahino/database';
import { ECDiscountCondition } from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { DiscountConditionTypeEnum } from '../discount-condition-type/enum';
import { UserVendorService } from '@rahino/ecommerce/user/user-vendor/user-vendor.service';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { EntityTypeService } from '@rahino/eav/admin/entity-type/entity-type.service';
import { ProductService } from '../../product-section/product/product.service';
import { UserInventoryService } from '@rahino/ecommerce/user/inventory/user-inventory.service';
import { ECDiscountConditionType } from '@rahino/localdatabase/models';

@Injectable()
export class DiscountConditionService {
  constructor(
    @InjectModel(ECDiscountCondition)
    private readonly repository: typeof ECDiscountCondition,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly userVendorService: UserVendorService,
    private readonly entityTypeService: EntityTypeService,
    private readonly productService: ProductService,
    private readonly userInventoryService: UserInventoryService,
  ) {}

  async findAll(user: User, filter: GetDiscountConditionDto) {
    const vendorIdsStringify =
      await this.userVendorService.findVendorIdsAsString(user);
    let queryBuilder = new QueryOptionsBuilder()
      .include([
        {
          attributes: ['id', 'name'],
          model: ECDiscountConditionType,
          as: 'conditionType',
        },
      ])
      .filter({ discountId: filter.discountId })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECDiscountCondition.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.literal(
          ` EXISTS (
        SELECT 1
        FROM ECDiscountConditions Basetbl
        WHERE Basetbl.discountId = ${filter.discountId}
          AND Basetbl.conditionTypeId = ${DiscountConditionTypeEnum.vendor}
          AND Basetbl.conditionValue in (${vendorIdsStringify})
      )`.replaceAll(/\s\s+/g, ' '),
        ),
      );
    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const conditions = await this.repository.findAll(queryBuilder.build());

    for (let index = 0; index < conditions.length; index++) {
      const condition = conditions[index];
      let name: string = null;
      switch (condition.conditionTypeId) {
        case DiscountConditionTypeEnum.entityType:
          name = (
            await this.entityTypeService.findByIdAnyway(
              Number(condition.conditionValue),
            )
          ).result.name;
          break;
        case DiscountConditionTypeEnum.product:
          name = (
            await this.productService.findByIdAnyway(
              user,
              condition.conditionValue,
            )
          ).result.title;
          break;
        case DiscountConditionTypeEnum.inventory:
          const inventory = (
            await this.userInventoryService.findByIdAnyway(
              condition.conditionValue,
              user,
            )
          ).result;
          name = inventory.product.title + `(شناسه موجودی: ${inventory.id})`;
          break;
        case DiscountConditionTypeEnum.vendor:
          name = (
            await this.userVendorService.findVendorAnyway(
              user,
              Number(condition.conditionValue),
            )
          ).vendor.name;
          break;
        default:
          throw new InternalServerErrorException(
            'the condition type with this given id not founded!',
          );
      }
      conditions[index].set('name', name);
    }

    return {
      result: conditions,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    const vendorIdsStringify =
      await this.userVendorService.findVendorIdsAsString(user);
    const queryBuilder = new QueryOptionsBuilder()
      .include([
        {
          attributes: ['id', 'name'],
          model: ECDiscountConditionType,
          as: 'conditionType',
        },
      ])
      .filter({ id: entityId })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECDiscountCondition.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.literal(
          ` EXISTS (
        SELECT 1
        FROM ECDiscountConditions Basetbl
        WHERE Basetbl.discountId = ECDiscountCondition.discountId
          AND Basetbl.conditionTypeId = ${DiscountConditionTypeEnum.vendor}
          AND Basetbl.conditionValue in (${vendorIdsStringify})
      )`.replaceAll(/\s\s+/g, ' '),
        ),
      );

    const result = await this.repository.findOne(queryBuilder.build());
    if (!result) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    let name: string = null;
    switch (result.conditionTypeId) {
      case DiscountConditionTypeEnum.entityType:
        name = (
          await this.entityTypeService.findByIdAnyway(
            Number(result.conditionValue),
          )
        ).result.name;
        break;
      case DiscountConditionTypeEnum.product:
        name = (
          await this.productService.findByIdAnyway(user, result.conditionValue)
        ).result.title;
        break;
      case DiscountConditionTypeEnum.inventory:
        const inventory = (
          await this.userInventoryService.findByIdAnyway(
            result.conditionValue,
            user,
          )
        ).result;
        name = inventory.product.title + `(شناسه موجودی: ${inventory.id})`;
        break;
      case DiscountConditionTypeEnum.vendor:
        name = (
          await this.userVendorService.findVendorAnyway(
            user,
            Number(result.conditionValue),
          )
        ).vendor.name;
        break;
      default:
        throw new InternalServerErrorException(
          'the condition type with this given id not founded!',
        );
    }
    result.set('name', name);

    return {
      result: result,
    };
  }

  async create(user: User, dto: DiscountConditionDto) {
    const vendorIds = await this.userVendorService.findVendorIds(user);
    const isAny = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ discountId: dto.discountId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECDiscountCondition.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ conditionTypeId: DiscountConditionTypeEnum.vendor })
        .filter({
          conditionValue: {
            [Op.in]: vendorIds,
          },
        })
        .build(),
    );
    if (!isAny) {
      throw new ForbiddenException("You don't access to operate this requeset");
    }
    let find: any = null;
    switch (dto.conditionTypeId) {
      case DiscountConditionTypeEnum.entityType:
        find = (
          await this.entityTypeService.findById(Number(dto.conditionValue))
        ).result;
        break;
      case DiscountConditionTypeEnum.product:
        find = (await this.productService.findById(user, dto.conditionValue))
          .result;
        break;
      case DiscountConditionTypeEnum.inventory:
        find = (
          await this.userInventoryService.findById(dto.conditionValue, user)
        ).result;
        break;
      case DiscountConditionTypeEnum.vendor:
        find = await this.userVendorService.isAccessToVendor(
          user,
          Number(dto.conditionValue),
        );
        break;
      default:
        throw new InternalServerErrorException(
          'the condition type with this given id not founded!',
        );
    }
    if (!find) {
      throw new ForbiddenException("You don't access to set this given value");
    }
    const mappedItem = this.mapper.map(
      dto,
      DiscountConditionDto,
      ECDiscountCondition,
    );
    const discountCondition = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    return { result: discountCondition };
  }

  async deleteById(user: User, entityId: bigint) {
    const vendorIdsStringify =
      await this.userVendorService.findVendorIdsAsString(user);
    const queryBuilder = new QueryOptionsBuilder()
      .filter({ id: entityId })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECDiscountCondition.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter(
        Sequelize.literal(
          ` EXISTS (
        SELECT 1
        FROM ECDiscountConditions Basetbl
        WHERE Basetbl.discountId = ECDiscountCondition.discountId
          AND Basetbl.conditionTypeId = ${DiscountConditionTypeEnum.vendor}
          AND Basetbl.conditionValue in (${vendorIdsStringify})
      )`.replaceAll(/\s\s+/g, ' '),
        ),
      );

    let result = await this.repository.findOne(queryBuilder.build());
    if (!result) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    if (result.isDefault) {
      throw new ForbiddenException('the default condition connot be deleted!');
    }
    result.isDeleted = true;
    result = await result.save();
    return {
      result: result,
    };
  }
}
