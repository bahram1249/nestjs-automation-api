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
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class VipBundleTypeService {
  constructor(
    @InjectModel(GSVipBundleType)
    private readonly repository: typeof GSVipBundleType,
    private readonly localizationService: LocalizationService,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(filter: GetVipBundleTypeDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        this.seqHelp.whereIsNullColumnEqualToZero(
          'GSVipBundleType.isDeleted',
          0,
        ),
      )
      .filter({ isSystemGenerated: false });

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
          this.seqHelp.whereIsNullColumnEqualToZero(
            'GSVipBundleType.isDeleted',
            0,
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
