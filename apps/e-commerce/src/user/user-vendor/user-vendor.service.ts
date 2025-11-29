import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { ECVendor } from '@rahino/localdatabase/models';
import { ECVendorUser } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { ECVendorCommission } from '@rahino/localdatabase/models';
import { ECVariationPrice } from '@rahino/localdatabase/models';
import { ECVendorCommissionType } from '@rahino/localdatabase/models';

@Injectable()
export class UserVendorService {
  constructor(
    @InjectModel(ECVendor)
    private repository: typeof ECVendor,
    @InjectModel(ECVendorUser)
    private vendorUserRepository: typeof ECVendorUser,
  ) {}

  async findAll(user: User, filter: ListFilter) {
    const vendorAccess = await this.vendorUserRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendorUser.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: ECVendor,
            as: 'vendor',
            required: true,
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('vendor.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          },
        ])
        .build(),
    );
    const vendorIds = vendorAccess.map((item) => item.vendorId);

    let queryBuilder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    if (vendorIds.length > 0) {
      queryBuilder = queryBuilder.filter({
        id: {
          [Op.in]: vendorIds,
        },
      });
    } else {
      queryBuilder = queryBuilder.filter(
        Sequelize.where(Sequelize.literal(vendorIds.length.toString()), {
          [Op.gt]: 0,
        }),
      );
    }
    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .attributes(['id', 'name', 'slug', 'address', 'priorityOrder'])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: [
            'id',
            'vendorId',
            'variationPriceId',
            'amount',
            'commissionTypeId',
          ],
          model: ECVendorCommission,
          as: 'commissions',
          required: false,
          where: Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('commissions.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
            {
              attributes: ['id', 'name'],
              model: ECVendorCommissionType,
              as: 'commissionType',
            },
          ],
        },
      ])

      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async isAccessToVendor(user: User, vendorId: number): Promise<boolean> {
    const findVendor = await this.vendorUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ vendorId: vendorId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendorUser.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: ECVendor,
            as: 'vendor',
            required: true,
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('vendor.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          },
        ])
        .build(),
    );
    if (findVendor) return true;
    return false;
  }

  async findVendorAnyway(user: User, vendorId: number): Promise<ECVendorUser> {
    const findVendor = await this.vendorUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ vendorId: vendorId })
        .include([
          {
            model: ECVendor,
            as: 'vendor',
            required: true,
          },
        ])
        .build(),
    );
    return findVendor;
  }

  async findVendorIds(user: User) {
    const vendorAccess = await this.vendorUserRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendorUser.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            model: ECVendor,
            as: 'vendor',
            required: true,
            where: Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('vendor.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          },
        ])
        .build(),
    );
    const vendorIds = vendorAccess.map((item) => item.vendorId);
    return vendorIds;
  }

  async findVendorIdsAsString(user: User) {
    const vendorIds = await this.findVendorIds(user);
    const vendorIdsString = vendorIds.map((item) => item.toString());
    const vendorIdsStringify = vendorIdsString.join(', ');
    return vendorIdsStringify != '' ? vendorIdsStringify : 'NULL';
  }
}
