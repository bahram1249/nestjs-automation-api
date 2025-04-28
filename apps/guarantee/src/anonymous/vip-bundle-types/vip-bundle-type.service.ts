import { Injectable, NotFoundException } from '@nestjs/common';
import { GetVipBundleTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSVipBundleType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class VipBundleTypeService {
  constructor(
    @InjectModel(GSVipBundleType)
    private readonly repository: typeof GSVipBundleType,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetVipBundleTypeDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSVipBundleType.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'title',
        'price',
        'fee',
        'monthPeriod',
        'cardColor',
        'createdAt',
        'updatedAt',
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
          'price',
          'fee',
          'monthPeriod',
          'cardColor',
          'createdAt',
          'updatedAt',
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSVipBundleType.isDeleted'),
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
        this.localizationService.translate('core.not_found_id'),
      );
    }

    return {
      result: item,
    };
  }
}
