import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@rahino/database';
import { EntityTypeFactorDto, GetEntityTypeFactorDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { ECEntityTypeFactor } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { I18nTranslations } from 'apps/main/src/generated/i18n.generated';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';

@Injectable()
export class EntityTypeFactorService {
  constructor(
    @InjectModel(ECEntityTypeFactor)
    private readonly repository: typeof ECEntityTypeFactor,
    private readonly i18n: I18nService<I18nTranslations>,
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async findAll(user: User, filter: GetEntityTypeFactorDto) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({ entityTypeId: filter.entityTypeId })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECEntityTypeFactor.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const count = await this.repository.count(queryBuilder.build());
    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: number, user: User) {
    const queryBuilder = new QueryOptionsBuilder()
      .filter({ id: entityId })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECEntityTypeFactor.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const result = await this.repository.findOne(queryBuilder.build());
    if (!result) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    return {
      result: result,
    };
  }

  async create(user: User, dto: EntityTypeFactorDto) {
    const entityType = await this.entityTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.entityTypeId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!entityType) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    const mappedItem = this.mapper.map(
      dto,
      EntityTypeFactorDto,
      ECEntityTypeFactor,
    );
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    return {
      result: result,
    };
  }

  async update(entityId: number, dto: EntityTypeFactorDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECEntityTypeFactor.isDeleted'),
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
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    if (dto.entityTypeId != item.entityTypeId) {
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }

    const mappedItem = this.mapper.map(
      dto,
      EntityTypeFactorDto,
      ECEntityTypeFactor,
    );
    const updateItem = _.omit(mappedItem.toJSON(), ['id']);
    await this.repository.update(updateItem, {
      where: {
        id: entityId,
      },
    });
    const result = (await this.findById(entityId, user)).result;
    return {
      result: result,
    };
  }

  async deleteById(entityId: number) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECEntityTypeFactor.isDeleted'),
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
      throw new NotFoundException(
        this.i18n.t('core.not_found_id', {
          lang: I18nContext.current().lang,
        }),
      );
    }
    item.isDeleted = true;
    item = await item.save();
    return {
      result: item,
    };
  }
}
