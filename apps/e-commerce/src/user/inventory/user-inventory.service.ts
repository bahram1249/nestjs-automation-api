import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { ECCity } from '@rahino/database/models/ecommerce-eav/ec-city.entity';
import { ECColor } from '@rahino/database/models/ecommerce-eav/ec-color.entity';
import { ECGuaranteeMonth } from '@rahino/database/models/ecommerce-eav/ec-guarantee-month.entity';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { ECInventoryPrice } from '@rahino/database/models/ecommerce-eav/ec-inventory-price.entity';
import { ECInventoryStatus } from '@rahino/database/models/ecommerce-eav/ec-inventory-status.entity';
import { ECInventory } from '@rahino/database/models/ecommerce-eav/ec-inventory.entity';
import { ECNeighborhood } from '@rahino/database/models/ecommerce-eav/ec-neighborhood.entity';
import { ECProduct } from '@rahino/database/models/ecommerce-eav/ec-product.entity';
import { ECProvince } from '@rahino/database/models/ecommerce-eav/ec-province.entity';
import { ECVariationPrice } from '@rahino/database/models/ecommerce-eav/ec-variation-prices';
import { ECVendorAddress } from '@rahino/database/models/ecommerce-eav/ec-vendor-address.entity';
import { ECVendorUser } from '@rahino/database/models/ecommerce-eav/ec-vendor-user.entity';
import { ECVendor } from '@rahino/database/models/ecommerce-eav/ec-vendor.entity';
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
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name', 'hexCode'],
          model: ECColor,
          as: 'color',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECGuarantee,
          as: 'guarantee',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECGuaranteeMonth,
          as: 'guaranteeMonth',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'onlyProvince',
          required: false,
        })
        .thenInlcude({
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
        .thenInlcude({
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
        .thenInlcude({
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
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECInventoryStatus,
          as: 'inventoryStatus',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECVendor,
          as: 'vendor',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name', 'hexCode'],
          model: ECColor,
          as: 'color',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECGuarantee,
          as: 'guarantee',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECGuaranteeMonth,
          as: 'guaranteeMonth',
          required: false,
        })
        .thenInlcude({
          attributes: ['id', 'name'],
          model: ECProvince,
          as: 'onlyProvince',
          required: false,
        })
        .thenInlcude({
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
        .thenInlcude({
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
        .thenInlcude({
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
