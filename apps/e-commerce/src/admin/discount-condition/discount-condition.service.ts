import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DiscountConditionDto, GetDiscountConditionDto } from './dto';
import { User } from '@rahino/database/models/core/user.entity';
import { ECDiscountCondition } from '@rahino/database/models/ecommerce-eav/ec-discount-condition.entity';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { DiscountConditionTypeEnum } from '../discount-condition-type/enum';
import { UserVendorService } from '@rahino/ecommerce/user/vendor/user-vendor.service';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { EntityTypeService } from '@rahino/eav/admin/entity-type/entity-type.service';
import { ProductService } from '../product/product.service';
import { UserInventoryService } from '@rahino/ecommerce/user/inventory/user-inventory.service';

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
    const vendorIdsStringify = await this.retrunVendorIdsAsString(user);
    let queryBuilder = new QueryOptionsBuilder()
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

    return {
      result: conditions,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    const vendorIdsStringify = await this.retrunVendorIdsAsString(user);
    let queryBuilder = new QueryOptionsBuilder()
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
    const vendorIdsStringify = await this.retrunVendorIdsAsString(user);
    let queryBuilder = new QueryOptionsBuilder()
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

  private async retrunVendorIdsAsString(user: User) {
    const vendorIds = await this.userVendorService.findVendorIds(user);
    const vendorIdsString = vendorIds.map((item) => item.toString());
    let vendorIdsStringify = vendorIdsString.join(', ');
    return vendorIdsStringify != '' ? vendorIdsStringify : 'NULL';
  }
}
