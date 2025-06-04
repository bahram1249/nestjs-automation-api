import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GetFaqDto, FaqDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { GSFaq } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(GSFaq)
    private readonly repository: typeof GSFaq,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetFaqDto) {
    let query = new QueryOptionsBuilder()
      .filter({
        question: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('GSFaq.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(query.build());

    query = query
      .attributes([
        'id',
        'question',
        'answer',
        'priority',
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
          'question',
          'answer',
          'priority',
          'createdAt',
          'updatedAt',
        ])
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSFaq.isDeleted'), 0),
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

  async create(dto: FaqDto) {
    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ question: dto.question })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSFaq.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (duplicateItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.item_exists'),
      );
    }

    const mappedItem = this.mapper.map(dto, FaqDto, GSFaq);
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );

    return {
      result: result,
    };
  }

  async updateById(id: number, dto: FaqDto) {
    const updatedItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSFaq.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!updatedItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const duplicateItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ question: dto.question })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('GSFaq.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          id: {
            [Op.ne]: id,
          },
        })
        .build(),
    );

    if (duplicateItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.item_exists'),
      );
    }

    const mappedItem = this.mapper.map(dto, FaqDto, GSFaq);
    await this.repository.update(_.omit(mappedItem.toJSON(), ['id']), {
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
            Sequelize.fn('isnull', Sequelize.col('GSFaq.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );

    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found'),
      );
    }

    item.isDeleted = true;
    await item.save();
    return {
      result: item,
    };
  }
}
