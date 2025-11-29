import {
  BadRequestException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { EAVEntityType, ECShippingWay } from '@rahino/localdatabase/models';
import { EntityTypeDto, EntityTypeV2Dto, GetEntityTypeDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVEntityModel } from '@rahino/localdatabase/models';
import * as _ from 'lodash';
import { Attachment } from '@rahino/database';
import { MinioClientService } from '@rahino/minio-client';
import { Response } from 'express';
import { User } from '@rahino/database';
import * as fs from 'fs';
import { ThumbnailService } from '@rahino/thumbnail';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class EntityTypeService {
  private entityTypeAttachmentType = 8;
  constructor(
    @InjectModel(EAVEntityType)
    private readonly repository: typeof EAVEntityType,
    @InjectModel(EAVEntityModel)
    private readonly entityModelRepository: typeof EAVEntityModel,
    @InjectModel(Attachment)
    private readonly attachmentRepository: typeof Attachment,
    @InjectModel(ECShippingWay)
    private readonly shippingWayRepository: typeof ECShippingWay,
    private minioClientService: MinioClientService,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly thumbnailService: ThumbnailService,
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
      );
    if (filter.entityModelId) {
      builder = builder.filter({
        entityModelId: filter.entityModelId,
      });
    }
    if (filter.parentEntityTypeId) {
      builder = builder.filter({
        parentEntityTypeId: filter.parentEntityTypeId,
      });
    }
    if (filter.ignoreChilds) {
      builder = builder.filter({
        parentEntityTypeId: {
          [Op.is]: null,
        },
      });
    }
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
        'createdAt',
        'updatedAt',
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const options = builder.build();
    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findAllV2(filter: GetEntityTypeDto) {
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
      );
    if (filter.entityModelId) {
      builder = builder.filter({
        entityModelId: filter.entityModelId,
      });
    }
    if (filter.parentEntityTypeId) {
      builder = builder.filter({
        parentEntityTypeId: filter.parentEntityTypeId,
      });
    }
    if (filter.ignoreChilds) {
      builder = builder.filter({
        parentEntityTypeId: {
          [Op.is]: null,
        },
      });
    }
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
            {
              attributes: ['id', 'title'],
              model: ECShippingWay,
              as: 'shippingWay',
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
        'shippingWayId',
        'createdAt',
        'updatedAt',
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });
    const options = builder.build();
    return {
      result: await this.repository.findAll(options),
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

    if (result.isDeleted) {
      throw new GoneException('item is deleted!');
    }

    return {
      result: result,
    };
  }

  async findByIdV2(id: number) {
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
        'shippingWayId',
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
        {
          attributes: ['id', 'title'],
          model: ECShippingWay,
          as: 'shippingWay',
          required: false,
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

    if (result.isDeleted) {
      throw new GoneException('item is deleted!');
    }

    return {
      result: result,
    };
  }

  async findByIdAnyway(id: number) {
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
        'shippingWayId',
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
        {
          attributes: ['id', 'title'],
          model: ECShippingWay,
          as: 'shippingWay',
          required: false,
        },
      ])
      .filter({ id });

    const result = await this.repository.findOne(builder.build());
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

  async findBySlugV2(slug: string) {
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
        'shippingWayId',
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
        {
          attributes: ['id', 'title'],
          model: ECShippingWay,
          as: 'shippingWay',
          required: false,
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

  async create(dto: EntityTypeDto) {
    const entityModel = await this.entityModelRepository.findOne({
      where: {
        id: dto.entityModelId,
      },
    });
    if (!entityModel) {
      throw new ForbiddenException('the given entityModelId not founded!');
    }

    if (dto.parentEntityTypeId) {
      const entityTypeParent = await this.repository.findOne({
        where: {
          id: dto.parentEntityTypeId,
          entityModelId: dto.entityModelId,
        },
      });
      if (!entityTypeParent) {
        throw new ForbiddenException(
          'the given parentEntityTypeId not founded!',
        );
      }
    }
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
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
    if (searchSlug) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.the_given_slug_is_exists_before',
        ),
      );
    }
    const mappedItem = this.mapper.map(dto, EntityTypeDto, EAVEntityType);
    const entityType = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    const builder = new QueryOptionsBuilder();
    const options = builder
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
        'createdAt',
        'updatedAt',
      ])
      .filter({ id: entityType.id })
      .include([
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
      .build();

    return {
      result: await this.repository.findOne(options),
    };
  }

  async createV2(dto: EntityTypeV2Dto) {
    const entityModel = await this.entityModelRepository.findOne({
      where: {
        id: dto.entityModelId,
      },
    });
    if (!entityModel) {
      throw new ForbiddenException('the given entityModelId not founded!');
    }

    if (dto.parentEntityTypeId) {
      const entityTypeParent = await this.repository.findOne({
        where: {
          id: dto.parentEntityTypeId,
          entityModelId: dto.entityModelId,
        },
      });
      if (!entityTypeParent) {
        throw new ForbiddenException(
          'the given parentEntityTypeId not founded!',
        );
      }
    }
    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
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
    if (searchSlug) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.the_given_slug_is_exists_before',
        ),
      );
    }

    const shippingWay = await this.shippingWayRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.shippingWayId }).build(),
    );

    if (!shippingWay) {
      throw new BadRequestException('the given shippingWayId not founded!');
    }

    const mappedItem = this.mapper.map(dto, EntityTypeV2Dto, EAVEntityType);
    const entityType = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    const builder = new QueryOptionsBuilder();
    const options = builder
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
        'shippingWayId',
        'createdAt',
        'updatedAt',
      ])
      .filter({ id: entityType.id })
      .include([
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
          attributes: ['id', 'title'],
          model: ECShippingWay,
          as: 'shippingWay',
          required: false,
        },
      ])
      .build();

    return {
      result: await this.repository.findOne(options),
    };
  }

  async update(id: number, dto: EntityTypeDto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
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
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const entityModel = await this.entityModelRepository.findOne({
      where: {
        id: dto.entityModelId,
      },
    });
    if (!entityModel) {
      throw new ForbiddenException('the given entityModelId not founded!');
    }

    if (dto.parentEntityTypeId) {
      const entityTypeParent = await this.repository.findOne({
        where: {
          id: dto.parentEntityTypeId,
          entityModelId: dto.entityModelId,
        },
      });
      if (!entityTypeParent) {
        throw new ForbiddenException(
          'the given parentEntityTypeId not founded!',
        );
      }
    }

    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter({
          id: {
            [Op.ne]: id,
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
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.the_given_slug_is_exists_before',
        ),
      );
    }

    const mappedItem = this.mapper.map(dto, EntityTypeDto, EAVEntityType);
    const entityType = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: { id },
        returning: true,
      },
    );
    const builder = new QueryOptionsBuilder();
    const options = builder
      .filter({ id: entityType[1][0].id })
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
      .build();
    return {
      result: await this.repository.findOne(options),
    };
  }

  async updateV2(id: number, dto: EntityTypeV2Dto) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
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
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const entityModel = await this.entityModelRepository.findOne({
      where: {
        id: dto.entityModelId,
      },
    });
    if (!entityModel) {
      throw new ForbiddenException('the given entityModelId not founded!');
    }

    if (dto.parentEntityTypeId) {
      const entityTypeParent = await this.repository.findOne({
        where: {
          id: dto.parentEntityTypeId,
          entityModelId: dto.entityModelId,
        },
      });
      if (!entityTypeParent) {
        throw new ForbiddenException(
          'the given parentEntityTypeId not founded!',
        );
      }
    }

    const searchSlug = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ slug: dto.slug })
        .filter({
          id: {
            [Op.ne]: id,
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
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        this.localizationService.translate(
          'core.the_given_slug_is_exists_before',
        ),
      );
    }

    const shippingWay = await this.shippingWayRepository.findOne(
      new QueryOptionsBuilder().filter({ id: dto.shippingWayId }).build(),
    );

    if (!shippingWay) {
      throw new BadRequestException('the given shippingWayId not founded!');
    }

    const mappedItem = this.mapper.map(dto, EntityTypeV2Dto, EAVEntityType);
    const entityType = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: { id },
        returning: true,
      },
    );
    const builder = new QueryOptionsBuilder();
    const options = builder
      .filter({ id: entityType[1][0].id })
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
          attributes: ['id', 'title'],
          model: ECShippingWay,
          as: 'shippingWay',
          required: false,
        },
      ])
      .build();
    return {
      result: await this.repository.findOne(options),
    };
  }

  async deleteById(id: number) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
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
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    item.isDeleted = true;
    item = await item.save();
    return {
      result: item,
    };
  }

  async uploadImage(id: number, user: User, file: Express.Multer.File) {
    // find brand item
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
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
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    // upload to s3 cloud
    const bucketName = 'entitytypes';
    await this.minioClientService.createBucket(bucketName);
    const buffer = await this.thumbnailService.resize(file.path);
    const uploadResult = await this.minioClientService.upload(
      bucketName,
      file.filename,
      buffer,
      {
        'Content-Type': file.mimetype,
      },
    );

    // remove old one if exists
    if (item.attachmentId) {
      let oldAttachment = await this.attachmentRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: item.attachmentId })
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .filter({ attachmentTypeId: this.entityTypeAttachmentType })
          .build(),
      );
      if (oldAttachment) {
        // remove from s3 cloud
        await this.minioClientService.remove(
          oldAttachment.bucketName,
          oldAttachment.fileName,
        );

        // remove in database
        oldAttachment.isDeleted = true;
        oldAttachment = await oldAttachment.save();
      }
    }

    // create new one
    const newAttachment = await this.attachmentRepository.create({
      attachmentTypeId: this.entityTypeAttachmentType,
      fileName: file.filename,
      originalFileName: file.originalname,
      mimetype: file.mimetype,
      etag: uploadResult.etag,
      versionId: uploadResult.versionId,
      bucketName: bucketName,
      userId: user.id,
    });
    item.attachmentId = newAttachment.id;
    item = await item.save();

    // remove file on current instanse
    fs.rmSync(file.path);

    return {
      result: _.pick(newAttachment, ['id', 'fileName']),
    };
  }

  async getPhoto(res: Response, fileName: string) {
    const attachment = await this.attachmentRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ fileName: fileName })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ attachmentTypeId: this.entityTypeAttachmentType })
        .build(),
    );
    if (!attachment) {
      throw new ForbiddenException("You don't have access to this file!");
    }
    const accessUrl = await this.minioClientService.generateDownloadUrl(
      attachment.bucketName,
      attachment.fileName,
    );
    return {
      result: accessUrl,
    };
  }
}
