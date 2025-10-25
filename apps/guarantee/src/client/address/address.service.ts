import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddressDto, GetAddressDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import {
  GSAddress,
  GSCity,
  GSNeighborhood,
  GSProvince,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class AddressService {
  constructor(
    @InjectModel(GSAddress) private repository: typeof GSAddress,
    @InjectModel(GSProvince) private provinceRepository: typeof GSProvince,
    @InjectModel(GSCity) private cityRepository: typeof GSCity,
    @InjectModel(GSNeighborhood)
    private neighborhoodRepository: typeof GSNeighborhood,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly localizationService: LocalizationService,
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
          Sequelize.fn('isnull', Sequelize.col('GSAddress.isDeleted'), 0),
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
        'postalCode',
      ])
      .include([
        {
          attributes: ['id', 'name'],
          model: GSProvince,
          as: 'province',
        },
        {
          attributes: ['id', 'name'],
          model: GSCity,
          as: 'city',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: GSNeighborhood,
          as: 'neighborhood',
        },
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
          'postalCode',
        ])
        .filter({
          userId: user.id,
        })
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSAddress.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .include([
          {
            attributes: ['id', 'name'],
            model: GSProvince,
            as: 'province',
          },
          {
            attributes: ['id', 'name'],
            model: GSCity,
            as: 'city',
            required: false,
          },
          {
            attributes: ['id', 'name'],
            model: GSNeighborhood,
            as: 'neighborhood',
          },
        ])
        .build(),
    );
    if (!address) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return {
      result: address,
    };
  }

  async create(dto: AddressDto, user?: User, transaction?: Transaction) {
    // if (dto.neighborhoodId == 0) {
    //   dto.neighborhoodId = null;
    // }

    const province = await this.provinceRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.provinceId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSProvince.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!province) {
      throw new BadRequestException(
        this.i18n.t('guarantee.province_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    if (dto.cityId) {
      const city = await this.cityRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: dto.cityId })
          .filter({ provinceId: dto.provinceId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('GSCity.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      if (!city) {
        throw new BadRequestException(
          this.i18n.t('guarantee.city_not_found', {
            lang: I18nContext.current().lang,
          }),
        );
      }
    }

    // if (city.neighborhoodBase === true) {
    //   if (!dto.neighborhoodId) {
    //     throw new BadRequestException(
    //       this.i18n.translate('guarantee.neighborhood_must_be_select_it', {
    //         lang: I18nContext.current().lang,
    //       }),
    //     );
    //   }
    //   const neighborhood = await this.neighborhoodRepository.findOne(
    //     new QueryOptionsBuilder()
    //       .filter({ id: dto.neighborhoodId })
    //       .filter({ cityId: dto.cityId })
    //       .filter(
    //         Sequelize.where(
    //           Sequelize.fn(
    //             'isnull',
    //             Sequelize.col('GSNeighborhood.isDeleted'),
    //             0,
    //           ),
    //           {
    //             [Op.eq]: 0,
    //           },
    //         ),
    //       )
    //       .build(),
    //   );
    //   if (!neighborhood) {
    //     throw new BadRequestException(
    //       this.i18n.translate('guarantee.neighbordhood_not_found', {
    //         lang: I18nContext.current().lang,
    //       }),
    //     );
    //   }
    // }

    const provinceValidPoint = await this.sequelize.query(
      `DECLARE @Point geography = geography::Point(${dto.latitude}, ${dto.longitude}, 4326)
      
        SELECT 1 
        FROM GSProvinces
        WHERE (geographyPolygon.STContains(@Point) = 1 OR geographyPolygon is null or (@Point.STDistance(geographyPolygon) / 1000 <= 1))
        AND id = ${dto.provinceId}
      
      `,
    );

    if (provinceValidPoint[0][0] == null) {
      throw new BadRequestException(
        this.localizationService.translate(
          'guarantee.point_in_this_province_not_valid',
        ),
      );
    }

    const mappedItem = this.mapper.map(dto, AddressDto, GSAddress);
    mappedItem.userId = user ? user.id : null;
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
      { transaction: transaction },
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
        'postalCode',
      ]),
    };
  }

  async update(
    user: User,
    entityId: bigint,
    dto: AddressDto,
    transaction?: Transaction,
  ) {
    // if (dto.neighborhoodId == 0) {
    //   dto.neighborhoodId = null;
    // }

    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          userId: user.id,
        })
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSAddress.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const province = await this.provinceRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.provinceId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSProvince.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!province) {
      throw new BadRequestException(
        this.i18n.t('guarantee.province_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    if (dto.cityId) {
      const city = await this.cityRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: dto.cityId })
          .filter({ provinceId: dto.provinceId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('GSCity.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      if (!city) {
        throw new BadRequestException(
          this.i18n.t('guarantee.city_not_found', {
            lang: I18nContext.current().lang,
          }),
        );
      }
    }

    // if (city.neighborhoodBase === true) {
    //   if (!dto.neighborhoodId) {
    //     throw new BadRequestException(
    //       this.i18n.translate('guarantee.neighborhood_must_be_select_it', {
    //         lang: I18nContext.current().lang,
    //       }),
    //     );
    //   }
    //   const neighborhood = await this.neighborhoodRepository.findOne(
    //     new QueryOptionsBuilder()
    //       .filter({ id: dto.neighborhoodId })
    //       .filter({ cityId: dto.cityId })
    //       .filter(
    //         Sequelize.where(
    //           Sequelize.fn(
    //             'isnull',
    //             Sequelize.col('GSNeighborhood.isDeleted'),
    //             0,
    //           ),
    //           {
    //             [Op.eq]: 0,
    //           },
    //         ),
    //       )
    //       .build(),
    //   );
    //   if (!neighborhood) {
    //     throw new BadRequestException(
    //       this.i18n.translate('guarantee.neighbordhood_not_found', {
    //         lang: I18nContext.current().lang,
    //       }),
    //     );
    //   }
    // }

    const mappedItem = this.mapper.map(dto, AddressDto, GSAddress);
    const result = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: {
          id: entityId,
        },
        returning: true,
        transaction: transaction,
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

  async deleteById(user: User, entityId: bigint) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          userId: user.id,
        })
        .filter({ id: entityId })

        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
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

  async updateByAnyUser(
    user: User,
    entityId: bigint,
    dto: AddressDto,
    transaction?: Transaction,
  ) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSAddress.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const province = await this.provinceRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.provinceId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSProvince.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!province) {
      throw new NotFoundException(
        this.i18n.t('guarantee.province_not_found', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    if (dto.cityId) {
      const city = await this.cityRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: dto.cityId })
          .filter({ provinceId: dto.provinceId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('GSCity.isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );
      if (!city) {
        throw new BadRequestException(
          this.i18n.t('guarantee.city_not_found', {
            lang: I18nContext.current().lang,
          }),
        );
      }
      // if (city.neighborhoodBase === true) {
      //   if (!dto.neighborhoodId) {
      //     throw new BadRequestException(
      //       this.i18n.translate('guarantee.neighborhood_must_be_select_it', {
      //         lang: I18nContext.current().lang,
      //       }),
      //     );
      //   }
      //   const neighborhood = await this.neighborhoodRepository.findOne(
      //     new QueryOptionsBuilder()
      //       .filter({ id: dto.neighborhoodId })
      //       .filter({ cityId: dto.cityId })
      //       .filter(
      //         Sequelize.where(
      //           Sequelize.fn(
      //             'isnull',
      //             Sequelize.col('GSNeighborhood.isDeleted'),
      //             0,
      //           ),
      //           {
      //             [Op.eq]: 0,
      //           },
      //         ),
      //       )
      //       .build(),
      //   );
      //   if (!neighborhood) {
      //     throw new BadRequestException(
      //       this.i18n.translate('guarantee.neighbordhood_not_found', {
      //         lang: I18nContext.current().lang,
      //       }),
      //     );
      //   }
      // }
    }

    const mappedItem = this.mapper.map(dto, AddressDto, GSAddress);
    const result = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: {
          id: entityId,
        },
        returning: true,
        transaction: transaction,
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
