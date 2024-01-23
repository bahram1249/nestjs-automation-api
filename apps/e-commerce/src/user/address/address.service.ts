import { Injectable, NotFoundException } from '@nestjs/common';
import { AddressDto, GetAddressDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECAddress } from '@rahino/database/models/ecommerce-eav/ec-address.entity';
import { User } from '@rahino/database/models/core/user.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(ECAddress) private repository: typeof ECAddress,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll(user: User, filter: GetAddressDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({
        userId: user.id,
      })
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECAddress.isDeleted'), 0),
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
        'latitude',
        'longitude',
        'provinceId',
        'cityId',
        'neighborhoodId',
        'street',
        'alley',
        'plaque',
        'floorNumber',
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }

  async findById(user: User, entityId: bigint) {
    const address = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
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
        ])
        .filter({
          userId: user.id,
        })
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECAddress.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!address) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: address,
    };
  }

  async create(user: User, dto: AddressDto) {
    const mappedItem = this.mapper.map(dto, AddressDto, ECAddress);
    mappedItem.userId = user.id;
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    return {
      result: _.pick(result, [
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
      ]),
    };
  }

  async update(user: User, entityId: bigint, dto: AddressDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          userId: user.id,
        })
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECAddress.isDeleted'), 0),
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

    const mappedItem = this.mapper.map(dto, AddressDto, ECAddress);
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
      result: _.pick(result[1][0], [
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
      ]),
    };
  }

  async deleteById(user: User, entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          userId: user.id,
        })
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECAddress.isDeleted'), 0),
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
      result: _.pick(item, [
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
      ]),
    };
  }
}
