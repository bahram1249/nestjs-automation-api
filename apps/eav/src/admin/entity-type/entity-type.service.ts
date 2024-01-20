import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { EntityTypeDto, GetEntityTypeDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVEntityModel } from '@rahino/database/models/eav/eav-entity-model.entity';
import * as _ from 'lodash';

@Injectable()
export class EntityTypeService {
  constructor(
    @InjectModel(EAVEntityType)
    private readonly repository: typeof EAVEntityType,
    @InjectModel(EAVEntityModel)
    private readonly entityModelRepository: typeof EAVEntityModel,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetEntityTypeDto) {
    let builder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0), {
          [Op.eq]: 0,
        }),
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
    const count = await this.repository.count(builder.build());
    builder = builder
      .include([
        {
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          model: EAVEntityType,
          as: 'parentEntityType',
          required: false,
        },
      ])
      .attributes(['id', 'name', 'slug', 'parentEntityTypeId', 'entityModelId'])
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
      .attributes(['id', 'name', 'slug', 'parentEntityTypeId', 'entityModelId'])
      .include([
        {
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          model: EAVEntityType,
          as: 'parentEntityType',
          required: false,
        },
      ])
      .filter({ id })
      .filter(
        Sequelize.where(Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0), {
          [Op.eq]: 0,
        }),
      );
    const result = await this.repository.findOne(builder.build());
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
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        'the item with this given slug is exists before!',
      );
    }
    const mappedItem = this.mapper.map(dto, EntityTypeDto, EAVEntityType);
    let entityType = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    let builder = new QueryOptionsBuilder();
    const options = builder
      .attributes(['id', 'name', 'slug', 'parentEntityTypeId', 'entityModelId'])
      .filter({ id: entityType.id })
      .include([
        {
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          model: EAVEntityType,
          as: 'parentEntityType',
          required: false,
        },
      ])
      .build();

    return {
      result: await this.repository.findOne(options),
    };
  }

  async update(id: number, dto: EntityTypeDto) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
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
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (searchSlug) {
      throw new BadRequestException(
        'the item with this given slug is exists before!',
      );
    }

    const mappedItem = this.mapper.map(dto, EntityTypeDto, EAVEntityType);
    let entityType = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: { id },
        returning: true,
      },
    );
    let builder = new QueryOptionsBuilder();
    const options = builder
      .filter({ id: entityType[1][0].id })
      .include([
        {
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          model: EAVEntityType,
          as: 'parentEntityType',
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
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!item) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    item.isDeleted = true;
    item = await item.save();
    return {
      result: item,
    };
  }
}
