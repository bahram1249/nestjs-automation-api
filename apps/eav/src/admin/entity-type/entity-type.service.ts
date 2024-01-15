import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { EntityTypeDto, GetEntityTypeDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVEntityModel } from '@rahino/database/models/eav/eav-entity-model.entity';

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
    let builder = new QueryOptionsBuilder().filter({
      name: {
        [Op.like]: filter.search,
      },
    });
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
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging);
    const options = builder.build();
    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    const builder = new QueryOptionsBuilder().filter({ id });
    return {
      result: await this.repository.findOne(builder.build()),
    };
  }
  async create(dto: EntityTypeDto) {
    const entityModel = await this.entityModelRepository.findOne({
      where: {
        id: dto.entityModelId,
      },
    });
    if (!entityModel)
      throw new ForbiddenException('the given entityModelId not founded!');

    if (dto.parentEntityTypeId) {
      const entityTypeParent = await this.repository.findOne({
        where: {
          id: dto.parentEntityTypeId,
          entityModelId: dto.entityModelId,
        },
      });
      if (!entityTypeParent)
        throw new ForbiddenException(
          'the given parentEntityTypeId not founded!',
        );
    }
    const mappedItem = this.mapper.map(dto, EntityTypeDto, EAVEntityType);
    let entityType = await this.repository.create(mappedItem.toJSON());
    let builder = new QueryOptionsBuilder();
    const options = builder
      .filter({ id: entityType.id })
      .include([
        {
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          model: EAVEntityType,
          as: 'parentEntityType',
        },
      ])
      .build();
    return {
      result: this.repository.findOne(options),
    };
  }
}
