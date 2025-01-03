import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { ECAddress } from '@rahino/database';
import { ECCity } from '@rahino/database';
import { ECColor } from '@rahino/database';
import { ECGuaranteeMonth } from '@rahino/database';
import { ECGuarantee } from '@rahino/database';
import { ECInventoryPrice } from '@rahino/database';
import { ECInventoryStatus } from '@rahino/database';
import { ECInventory } from '@rahino/database';
import { ECNeighborhood } from '@rahino/database';
import { ECProduct } from '@rahino/database';
import { ECProvince } from '@rahino/database';
import { ECVariationPrice } from '@rahino/database';
import { ECVendorAddress } from '@rahino/database';
import { ECVendorUser } from '@rahino/database';
import { ECVendor } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class UserInventoryService {
  constructor(
    @InjectModel(ECVendorUser)
    private readonly vendorUserRepository: typeof ECVendorUser,
    @InjectModel(ECInventory)
    private readonly inventoryRepository: typeof ECInventory,
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
      .include([
        {
          attributes: ['id', 'title'],
          model: ECProduct,
          as: 'product',
        },
      ])
      .filter({
        vendorId: {
          [Op.in]: vendorIds,
        },
      })
      .filter({
        [Op.or]: [
          {
            id: {
              [Op.like]: filter.search,
            },
          },
          {
            '$product.title$': {
              [Op.like]: filter.search,
            },
          },
        ],
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECInventory.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.inventoryRepository.count(queryBuilder.build());
    const result = await this.inventoryRepository.findAll(
      queryBuilder
        .attributes([
          'id',
          'productId',
          'vendorId',
          'colorId',
          'guaranteeId',
          'guaranteeMonthId',
          'buyPrice',
          'qty',
          'onlyProvinceId',
          'vendorAddressId',
          'weight',
          'inventoryStatusId',
          'description',
        ])
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name', 'hexCode'],
          model: ECColor,
          as: 'color',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECGuarantee,
          as: 'guarantee',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECGuaranteeMonth,
          as: 'guaranteeMonth',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'onlyProvince',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'vendorId', 'addressId'],
          model: ECVendorAddress,
          as: 'vendorAddress',
          required: false,
          include: [
            {
              attributes: [
                'id',
                'name',
                'latitude',
                'longitude',
                'provinceId',
                'cityId',
                'neighborhoodId',
                'street',
                'alley',
                'plaque',
                'floorNumber',
              ],
              model: ECAddress,
              as: 'address',
              required: false,
              include: [
                {
                  attributes: ['id', 'name'],
                  model: ECProvince,
                  as: 'province',
                  required: false,
                },
                {
                  attributes: ['id', 'name'],
                  model: ECCity,
                  as: 'city',
                  required: false,
                },
                {
                  attributes: ['id', 'name'],
                  model: ECNeighborhood,
                  as: 'neighborhood',
                  required: false,
                },
              ],
            },
            {
              attributes: ['id', 'name'],
              model: ECVendor,
              as: 'vendor',
              required: false,
            },
          ],
        })
        .thenInclude({
          attributes: ['price'],
          model: ECInventoryPrice,
          as: 'firstPrice',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
          ],
          where: Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('firstPrice.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        })
        .thenInclude({
          attributes: ['price'],
          model: ECInventoryPrice,
          as: 'secondaryPrice',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
          ],
          where: Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('secondaryPrice.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        })
        .limit(filter.limit)
        .offset(filter.offset)
        .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
        .build(),
    );
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: bigint, user: User) {
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
      .include([
        {
          attributes: ['id', 'title'],
          model: ECProduct,
          as: 'product',
        },
      ])
      .filter({ id: entityId })
      .filter({
        vendorId: {
          [Op.in]: vendorIds,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECInventory.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const result = await this.inventoryRepository.findOne(
      queryBuilder
        .attributes([
          'id',
          'productId',
          'vendorId',
          'colorId',
          'guaranteeId',
          'guaranteeMonthId',
          'buyPrice',
          'qty',
          'onlyProvinceId',
          'vendorAddressId',
          'weight',
          'inventoryStatusId',
          'description',
        ])
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name', 'hexCode'],
          model: ECColor,
          as: 'color',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECGuarantee,
          as: 'guarantee',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECGuaranteeMonth,
          as: 'guaranteeMonth',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'onlyProvince',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'vendorId', 'addressId'],
          model: ECVendorAddress,
          as: 'vendorAddress',
          required: false,
          include: [
            {
              attributes: [
                'id',
                'name',
                'latitude',
                'longitude',
                'provinceId',
                'cityId',
                'neighborhoodId',
                'street',
                'alley',
                'plaque',
                'floorNumber',
              ],
              model: ECAddress,
              as: 'address',
              required: false,
              include: [
                {
                  attributes: ['id', 'name'],
                  model: ECProvince,
                  as: 'province',
                  required: false,
                },
                {
                  attributes: ['id', 'name'],
                  model: ECCity,
                  as: 'city',
                  required: false,
                },
                {
                  attributes: ['id', 'name'],
                  model: ECNeighborhood,
                  as: 'neighborhood',
                  required: false,
                },
              ],
            },
            {
              attributes: ['id', 'name'],
              model: ECVendor,
              as: 'vendor',
              required: false,
            },
          ],
        })
        .thenInclude({
          attributes: ['price'],
          model: ECInventoryPrice,
          as: 'firstPrice',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
          ],
          where: Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('firstPrice.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        })
        .thenInclude({
          attributes: ['price'],
          model: ECInventoryPrice,
          as: 'secondaryPrice',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
          ],
          where: Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('secondaryPrice.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        })
        .build(),
    );
    return {
      result: result,
    };
  }

  async findByIdAnyway(entityId: bigint, user: User) {
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
      .include([
        {
          attributes: ['id', 'title'],
          model: ECProduct,
          as: 'product',
        },
      ])
      .filter({ id: entityId })
      .filter({
        vendorId: {
          [Op.in]: vendorIds,
        },
      });

    const result = await this.inventoryRepository.findOne(
      queryBuilder
        .attributes([
          'id',
          'productId',
          'vendorId',
          'colorId',
          'guaranteeId',
          'guaranteeMonthId',
          'buyPrice',
          'qty',
          'onlyProvinceId',
          'vendorAddressId',
          'weight',
          'inventoryStatusId',
          'description',
        ])
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name', 'hexCode'],
          model: ECColor,
          as: 'color',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECGuarantee,
          as: 'guarantee',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECGuaranteeMonth,
          as: 'guaranteeMonth',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'onlyProvince',
          required: false,
        })
        .thenInclude({
          attributes: ['id', 'vendorId', 'addressId'],
          model: ECVendorAddress,
          as: 'vendorAddress',
          required: false,
          include: [
            {
              attributes: [
                'id',
                'name',
                'latitude',
                'longitude',
                'provinceId',
                'cityId',
                'neighborhoodId',
                'street',
                'alley',
                'plaque',
                'floorNumber',
              ],
              model: ECAddress,
              as: 'address',
              required: false,
              include: [
                {
                  attributes: ['id', 'name'],
                  model: ECProvince,
                  as: 'province',
                  required: false,
                },
                {
                  attributes: ['id', 'name'],
                  model: ECCity,
                  as: 'city',
                  required: false,
                },
                {
                  attributes: ['id', 'name'],
                  model: ECNeighborhood,
                  as: 'neighborhood',
                  required: false,
                },
              ],
            },
            {
              attributes: ['id', 'name'],
              model: ECVendor,
              as: 'vendor',
              required: false,
            },
          ],
        })
        .thenInclude({
          attributes: ['price'],
          model: ECInventoryPrice,
          as: 'firstPrice',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
          ],
          where: Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('firstPrice.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        })
        .thenInclude({
          attributes: ['price'],
          model: ECInventoryPrice,
          as: 'secondaryPrice',
          required: false,
          include: [
            {
              attributes: ['id', 'name'],
              model: ECVariationPrice,
              as: 'variationPrice',
            },
          ],
          where: Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('secondaryPrice.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        })
        .build(),
    );
    return {
      result: result,
    };
  }
}
