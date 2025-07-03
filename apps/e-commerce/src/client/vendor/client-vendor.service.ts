import { Injectable, NotFoundException } from '@nestjs/common';
import { GetVendorDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { ECVendor } from '@rahino/localdatabase/models';
import { Attachment } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class ClientVendorService {
  constructor(
    @InjectModel(ECVendor)
    private readonly repository: typeof ECVendor,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetVendorDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const count = await this.repository.count(queryBuilder.build());
    queryBuilder = queryBuilder
      .attributes([
        'id',
        'name',
        'slug',
        'address',
        'priorityOrder',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: number) {
    const vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'description',
          'address',
          'priorityOrder',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
        ])
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
        ])
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!vendor) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    return {
      result: vendor,
    };
  }

  async findBySlug(slug: string) {
    const vendor = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'name',
          'slug',
          'address',
          'description',
          'metaTitle',
          'metaKeywords',
          'metaDescription',
        ])
        .include([
          {
            attributes: ['id', 'fileName'],
            model: Attachment,
            as: 'attachment',
            required: false,
          },
        ])
        .filter({ slug })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECVendor.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!vendor) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_slug'),
      );
    }
    return {
      result: vendor,
    };
  }
}
