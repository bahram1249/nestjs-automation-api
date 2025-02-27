import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ECVendorUser } from '@rahino/localdatabase/models';
import { GetVendorAddressDto, VendorAddressDto } from './dto';
import { User } from '@rahino/database';
import { ECVendorAddress } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { ECAddress } from '@rahino/localdatabase/models';
import { ECVendor } from '@rahino/localdatabase/models';
import { AddressService } from '@rahino/ecommerce/user/address/address.service';

@Injectable()
export class VendorAddressService {
  constructor(
    @InjectModel(ECVendorUser)
    private readonly vendorUserRepository: typeof ECVendorUser,
    @InjectModel(ECVendorAddress)
    private readonly vendorAddressRepository: typeof ECVendorAddress,
    private readonly addressService: AddressService,
  ) {}

  async findAll(user: User, filter: GetVendorAddressDto) {
    // all vendors this user have access
    const vendors = await this.vendorUserRepository.findAll(
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
        .build(),
    );

    // all vendor addresses is available
    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECVendorAddress.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );

    const vendorIds = vendors.map((vendor) => vendor.vendorId);
    if (vendorIds.length > 0) {
      queryBuilder = queryBuilder.filter({
        vendorId: {
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

    if (filter.vendorId) {
      queryBuilder = queryBuilder.filter({
        vendorId: filter.vendorId,
      });
    }

    const count = await this.vendorAddressRepository.count(
      queryBuilder.build(),
    );
    const vendorAddresses = await this.vendorAddressRepository.findAll(
      queryBuilder
        .include([
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
              'postalCode',
            ],
            model: ECAddress,
            as: 'address',
          },
          {
            attributes: ['id', 'name'],
            model: ECVendor,
            as: 'vendor',
          },
        ])
        .limit(filter.limit)
        .offset(filter.offset)
        .build(),
    );

    return {
      result: vendorAddresses,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    // all vendors this user have access
    const vendors = await this.vendorUserRepository.findAll(
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
        .build(),
    );

    // all vendor addresses is available
    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECVendorAddress.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );

    const vendorIds = vendors.map((vendor) => vendor.vendorId);
    if (vendorIds.length > 0) {
      queryBuilder = queryBuilder.filter({
        vendorId: {
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

    const vendorAddress = await this.vendorAddressRepository.findOne(
      queryBuilder
        .filter({ id: entityId })
        .include([
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
              'postalCode',
            ],
            model: ECAddress,
            as: 'address',
          },
          {
            attributes: ['id', 'name'],
            model: ECVendor,
            as: 'vendor',
          },
        ])
        .build(),
    );

    if (!vendorAddress) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    return {
      result: vendorAddress,
    };
  }

  async create(user: User, dto: VendorAddressDto) {
    // is access to this given vendor
    const vendor = await this.vendorUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ vendorId: dto.vendorId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendorUser.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!vendor) {
      throw new ForbiddenException(
        'You are not permitted to perform this operation',
      );
    }
    // create address item
    const addressResult = await this.addressService.create(user, dto);
    // create vendor address item
    let vendorAddress = await this.vendorAddressRepository.create({
      vendorId: dto.vendorId,
      addressId: addressResult.result.id,
      userId: user.id,
    });
    // query with included things
    vendorAddress = await this.vendorAddressRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: vendorAddress.id })
        .include([
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
              'postalCode',
            ],
            model: ECAddress,
            as: 'address',
          },
          {
            attributes: ['id', 'name'],
            model: ECVendor,
            as: 'vendor',
          },
        ])
        .build(),
    );

    return {
      result: vendorAddress,
    };
  }

  async update(user: User, entityId: bigint, dto: VendorAddressDto) {
    // find updating item
    let vendorAddress = await this.vendorAddressRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECVendorAddress.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!vendorAddress) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    if (vendorAddress.vendorId != dto.vendorId) {
      throw new BadRequestException('vendor item cannot be change');
    }

    // is access to this given vendor
    const vendor = await this.vendorUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ vendorId: dto.vendorId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendorUser.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!vendor) {
      throw new ForbiddenException(
        'You are not permitted to perform this operation',
      );
    }

    // update address item
    await this.addressService.updateByAnyUser(
      user,
      vendorAddress.addressId,
      dto,
    );

    // query with included things
    vendorAddress = await this.vendorAddressRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: vendorAddress.id })
        .include([
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
              'postalCode',
            ],
            model: ECAddress,
            as: 'address',
          },
          {
            attributes: ['id', 'name'],
            model: ECVendor,
            as: 'vendor',
          },
        ])
        .build(),
    );

    return {
      result: vendorAddress,
    };
  }

  async deleteById(user: User, entityId: bigint) {
    // all vendors this user have access
    const vendors = await this.vendorUserRepository.findAll(
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
        .build(),
    );

    // all vendor addresses is available
    let queryBuilder = new QueryOptionsBuilder().filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('ECVendorAddress.isDeleted'), 0),
        {
          [Op.eq]: 0,
        },
      ),
    );

    const vendorIds = vendors.map((vendor) => vendor.vendorId);
    if (vendorIds.length > 0) {
      queryBuilder = queryBuilder.filter({
        vendorId: {
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
    let vendorAddress = await this.vendorAddressRepository.findOne(
      queryBuilder
        .filter({ id: entityId })
        .include([
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
              'postalCode',
            ],
            model: ECAddress,
            as: 'address',
          },
          {
            attributes: ['id', 'name'],
            model: ECVendor,
            as: 'vendor',
          },
        ])
        .build(),
    );

    if (!vendorAddress) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    await this.addressService.deleteById(user, vendorAddress.addressId);
    vendorAddress.isDeleted = true;
    vendorAddress = await vendorAddress.save();

    vendorAddress = await this.vendorAddressRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .include([
          {
            model: ECAddress,
            as: 'address',
          },
          {
            attributes: ['id', 'name'],
            model: ECVendor,
            as: 'vendor',
          },
        ])
        .build(),
    );

    return {
      result: vendorAddress,
    };
  }
}
