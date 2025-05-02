import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import * as _ from 'lodash';
import { Attachment } from '@rahino/database';
import {
  EAVEntityType,
  ECBrand,
  ECLinkedEntityTypeBrand,
} from '@rahino/localdatabase/models';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GetLinkedEntityTypeBrandDto } from './dto';

@Injectable()
export class LinkedEntityTypeBrandService {
  constructor(
    @InjectModel(ECLinkedEntityTypeBrand)
    private readonly repository: typeof ECLinkedEntityTypeBrand,
    private readonly localizationService: LocalizationService,
  ) {}

  async findById(filter: GetLinkedEntityTypeBrandDto) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .include([
        {
          model: EAVEntityType,
          as: 'entityType',
          attributes: ['id', 'name', 'slug', 'attachmentId'],
          required: true,
          where: {
            slug: filter.entityTypeSlug,
          },
          include: [
            {
              model: Attachment,
              as: 'attachment',
              required: false,
              attributes: ['id', 'fileName'],
            },
          ],
        },
        {
          model: ECBrand,
          as: 'brand',
          required: true,
          attributes: ['id', 'name', 'slug', 'attachmentId'],
          where: {
            slug: filter.brandSlug,
          },
          include: [
            {
              model: Attachment,
              as: 'attachment',
              required: false,
              attributes: ['id', 'fileName'],
            },
          ],
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLinkedEntityTypeBrand.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_slug'),
      );
    }
    return {
      result: item,
    };
  }
}
