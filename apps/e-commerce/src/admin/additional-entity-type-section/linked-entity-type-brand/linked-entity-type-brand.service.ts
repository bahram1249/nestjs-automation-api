import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LinkedEntityTypeBrandDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { Attachment, User } from '@rahino/database';
import {
  EAVEntityType,
  ECBrand,
  ECLinkedEntityTypeBrand,
  ECPage,
} from '@rahino/localdatabase/models';
import { ListFilter } from '@rahino/query-filter';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class LinkedEntityTypeBrandService {
  constructor(
    @InjectModel(ECLinkedEntityTypeBrand)
    private readonly repository: typeof ECLinkedEntityTypeBrand,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: ListFilter) {
    let queryBuilder = new QueryOptionsBuilder().filter(
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

    const count = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .limit(filter.limit)
      .offset(filter.offset)
      .order({
        orderBy: filter.orderBy,
        sortOrder: filter.sortOrder,
      });

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: number) {
    let queryBuilder = new QueryOptionsBuilder();
    queryBuilder = queryBuilder
      .include([
        {
          model: EAVEntityType,
          as: 'entityType',
          attributes: ['id', 'name', 'slug', 'attachmentId'],
          required: true,
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
      )
      .filter({ id: entityId });
    const item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    return {
      result: item,
    };
  }

  async create(dto: LinkedEntityTypeBrandDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ brandId: dto.brandId })
        .filter({ entityTypeId: dto.entityTypeId })
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
        )
        .build(),
    );
    if (item) {
      throw new BadRequestException(
        this.localizationService.translate('core.item_exists'),
      );
    }

    const mappedItem = this.mapper.map(
      dto,
      LinkedEntityTypeBrandDto,
      ECLinkedEntityTypeBrand,
    );
    const result = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );

    return await this.findById(result.id);
  }

  async update(entityId: number, dto: LinkedEntityTypeBrandDto, user: User) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
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
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    const searchItem = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ brandId: dto.brandId })
        .filter({ entityTypeId: dto.entityTypeId })
        .filter({
          id: {
            [Op.ne]: entityId,
          },
        })
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
        )
        .build(),
    );
    if (searchItem) {
      throw new BadRequestException(
        this.localizationService.translate('core.item_exists'),
      );
    }
    const mappedItem = this.mapper.map(
      dto,
      LinkedEntityTypeBrandDto,
      ECLinkedEntityTypeBrand,
    );
    const result = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: {
          id: entityId,
        },
        returning: true,
      },
    );
    return await this.findById(entityId);
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
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
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, [
        'id',
        'title',
        'brandId',
        'entityTypeId',
        'metaTitle',
        'metaKeywords',
        'metaDescription',
        'description',
        'createdAt',
        'updatedAt',
      ]),
    };
  }
}
