import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { GetEntityTypeDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVEntityModel } from '@rahino/localdatabase/models';
import * as _ from 'lodash';
import { Attachment } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class EntityTypeService {
  constructor(
    @InjectModel(EAVEntityType)
    private readonly repository: typeof EAVEntityType,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetEntityTypeDto) {
    let builder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(filter.entityModelId != null, {
        entityModelId: filter.entityModelId,
      })
      .filterIf(filter.parentEntityTypeId != null, {
        parentEntityTypeId: filter.parentEntityTypeId,
      })
      .filterIf(filter.ignoreChilds == true, {
        parentEntityTypeId: {
          [Op.is]: null,
        },
      });

    const count = await this.repository.count(builder.build());

    builder = builder
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
          required: false,
          include: [
            {
              attributes: ['id', 'fileName'],
              model: Attachment,
              as: 'attachment',
              required: false,
            },
          ],
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'subEntityTypes',
          required: false,
          where: Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('subEntityTypes.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
          include: [
            {
              attributes: ['id', 'name', 'slug'],
              model: EAVEntityType,
              as: 'subEntityTypes',
              required: false,
              where: Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('subEntityTypes.subEntityTypes.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
              include: [
                {
                  attributes: ['id', 'fileName'],
                  model: Attachment,
                  as: 'attachment',
                  required: false,
                },
              ],
            },
            {
              attributes: ['id', 'fileName'],
              model: Attachment,
              as: 'attachment',
              required: false,
            },
          ],
        },
      ])
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'priority',
        'showLanding',
        'isDeleted',
        'createdAt',
        'updatedAt',
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.repository.findAll(builder.build()),
      total: count,
    };
  }

  async findById(id: number) {
    const builder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'showLanding',
        'isDeleted',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
          required: false,
          include: [
            {
              attributes: ['id', 'fileName'],
              model: Attachment,
              as: 'attachment',
              required: false,
            },
          ],
        },
      ])
      .filter({ id });
    // .filter(
    //   Sequelize.where(
    //     Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
    //     {
    //       [Op.eq]: 0,
    //     },
    //   ),
    // );

    const result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    if (!result.isDeleted) {
      throw new GoneException('item is deleted !');
    }

    return {
      result: result,
    };
  }

  async findBySlug(slug: string) {
    const builder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'priority',
        'showLanding',
        'isDeleted',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
          required: false,
          include: [
            {
              attributes: ['id', 'fileName'],
              model: Attachment,
              as: 'attachment',
              required: false,
            },
          ],
        },
      ])
      .filter({ slug: slug });
    // .filter(
    //   Sequelize.where(
    //     Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
    //     {
    //       [Op.eq]: 0,
    //     },
    //   ),
    // );

    const result = await this.repository.findOne(builder.build());
    if (!result) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_slug'),
      );
    }

    if (result.isDeleted) {
      throw new GoneException('item is deleted!');
    }

    return {
      result: result,
    };
  }
}
