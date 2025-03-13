import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetAdditionalPackageDto, AdditionalPackageDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSAdditionalPackage } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';

@Injectable()
export class AdditionalPackageService {
  constructor(
    @InjectModel(GSAdditionalPackage)
    private readonly repository: typeof GSAdditionalPackage,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetAdditionalPackageDto) {
    let query = new QueryOptionsBuilder().filter({
      title: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'title', 'price', 'createdAt', 'updatedAt'])
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSAdditionalPackage.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
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
        .attributes(['id', 'title', 'price', 'createdAt', 'updatedAt'])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAdditionalPackage.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
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

  async create(dto: AdditionalPackageDto) {
    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAdditionalPackage.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ title: dto.title })
        .build(),
    );
    if (duplicateItem) {
      throw new BadRequestException(
        this.i18n.t('core.item_exists', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const mappedItem = this.mapper.map(
      dto,
      AdditionalPackageDto,
      GSAdditionalPackage,
    );
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
    insertedItem.unitPriceId = GSUnitPriceEnum.Toman;

    const result = await this.repository.create(insertedItem);

    return {
      result: result,
    };
  }

  async updateById(id: number, dto: AdditionalPackageDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAdditionalPackage.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!item) {
      throw new BadRequestException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAdditionalPackage.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
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

    const mappedItem = this.mapper.map(
      dto,
      AdditionalPackageDto,
      GSAdditionalPackage,
    );
    const updatedItem = _.omit(mappedItem.toJSON(), ['id']);
    updatedItem.unitPriceId = GSUnitPriceEnum.Toman;
    await this.repository.update(updatedItem, {
      where: {
        id: id,
      },
    });

    return await this.findById(id);
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSAdditionalPackage.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new BadRequestException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, ['id', 'title', 'price', 'createdAt', 'updatedAt']),
    };
  }
}
