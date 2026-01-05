import { Injectable, NotFoundException } from '@nestjs/common';
import { GetDiscountTypeDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSDiscountType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op } from 'sequelize';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class DiscountTypeService {
  constructor(
    @InjectModel(GSDiscountType)
    private readonly repository: typeof GSDiscountType,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetDiscountTypeDto) {
    let query = new QueryOptionsBuilder().filter({
      title: {
        [Op.like]: filter.search,
      },
    });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'title'])
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
        .attributes(['id', 'title'])
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
