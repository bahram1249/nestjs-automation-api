import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetProductTypeDto, ProductTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSProductType, GSProvider } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';

@Injectable()
export class ProductTypeService {
  constructor(
    @InjectModel(GSProductType)
    private readonly repository: typeof GSProductType,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetProductTypeDto) {
    let query = new QueryOptionsBuilder().filter({
      title: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'title',
        'providerId',
        'mandatoryAttendance',
        'description',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: GSProvider,
          as: 'provider',
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'title',
          'providerId',
          'mandatoryAttendance',
          'description',
          'createdAt',
          'updatedAt',
        ])
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

    return {
      result: item,
    };
  }

  async create(dto: ProductTypeDto) {
    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ title: dto.title }).build(),
    );
    if (duplicateItem) {
      throw new BadRequestException(
        this.i18n.t('core.item_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const mappedItem = this.mapper.map(dto, ProductTypeDto, GSProductType);
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );

    return {
      result: result,
    };
  }

  async updateById(id: number, dto: ProductTypeDto) {
    const updatedItem = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id: id }).build(),
    );

    if (!updatedItem) {
      throw new BadRequestException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ title: dto.title })
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );

    if (duplicateItem) {
      throw new BadRequestException(
        this.i18n.t('core.item_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const mappedItem = this.mapper.map(dto, ProductTypeDto, GSProductType);
    const result = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id', 'providerBaseId', 'providerId']),
      {
        where: {
          id: id,
        },
      },
    );

    return await this.findById(id);
  }

  async deleteById(entityId: number) {
    throw new Error('Method not implemented.');
  }
}
