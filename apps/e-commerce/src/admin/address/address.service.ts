import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddressDto, GetAddressDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECAddress } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { ECProvince } from '@rahino/localdatabase/models';
import { ECCity } from '@rahino/localdatabase/models';
import { ECNeighborhood } from '@rahino/localdatabase/models';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class AdminAddressService {
  constructor(
    @InjectModel(ECAddress) private repository: typeof ECAddress,
    @InjectModel(ECProvince) private provinceRepository: typeof ECProvince,
    @InjectModel(ECCity) private cityRepository: typeof ECCity,
    @InjectModel(ECNeighborhood)
    private neighborhoodRepository: typeof ECNeighborhood,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly i18n: I18nService<I18nTranslations>,
  ) {}

  async findAll(userId: bigint, user: User, filter: GetAddressDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .include([
        {
          attributes: [
            'id',
            'firstname',
            'lastname',
            'username',
            'phoneNumber',
          ],
          model: User,
          as: 'user',
          required: true,
        },
      ])
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
      )
      .filter({ userId: userId });

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
        'postalCode',
      ])
      .thenInclude({
        attributes: ['id', 'name'],
        model: ECProvince,
        as: 'province',
      })
      .thenInclude({
        attributes: ['id', 'name'],
        model: ECCity,
        as: 'city',
      })
      .thenInclude({
        attributes: ['id', 'name'],
        model: ECNeighborhood,
        as: 'neighborhood',
      })
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
          'postalCode',
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
        .include([
          {
            attributes: [
              'id',
              'firstname',
              'lastname',
              'username',
              'phoneNumber',
            ],
            model: User,
            as: 'user',
          },
          {
            attributes: ['id', 'name'],
            model: ECProvince,
            as: 'province',
          },
          {
            attributes: ['id', 'name'],
            model: ECCity,
            as: 'city',
          },
          {
            attributes: ['id', 'name'],
            model: ECNeighborhood,
            as: 'neighborhood',
          },
        ])
        .build(),
    );
    if (!address) {
      throw new NotFoundException('the item with this given id not founded!');
    }
    return {
      result: address,
    };
  }

  async update(user: User, entityId: bigint, dto: AddressDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
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

    const province = await this.provinceRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.provinceId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECProvince.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!province) {
      throw new BadRequestException('the given provinceId not founded!');
    }

    const city = await this.cityRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.cityId })
        .filter({ provinceId: dto.provinceId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECCity.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!city) {
      throw new BadRequestException('the given cityId not founded!');
    }

    if (city.neighborhoodBase === true) {
      if (!dto.neighborhoodId) {
        throw new BadRequestException(
          this.i18n.translate('ecommerce.neighborhood_must_be_select_it', {
            lang: I18nContext.current().lang,
          }),
        );
      }
      const neighborhood = await this.neighborhoodRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: dto.neighborhoodId })
          .filter({ cityId: dto.cityId })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECNeighborhood.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      if (!neighborhood) {
        throw new BadRequestException('the given neighborhood not founded!');
      }
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
        'postalCode',
      ]),
    };
  }
}
