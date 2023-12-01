import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { AttributeDto, GetAttributeDto } from './dto';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVEntityAttribute } from '@rahino/database/models/eav/eav-entity-attribute.entity';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVAttributeType } from '@rahino/database/models/eav/eav-attribute-type.entity';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(EAVAttribute)
    private readonly repository: typeof EAVAttribute,
    @InjectModel(EAVEntityAttribute)
    private readonly entityAttributeRepository: typeof EAVEntityAttribute,
    @InjectModel(EAVAttributeType)
    private readonly attributeTypeRepository: typeof EAVAttributeType,
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetAttributeDto) {
    let builder = new QueryOptionsBuilder();
    builder = builder.filter({
      name: {
        [Op.like]: filter.search,
      },
    });
    if (filter.entityTypeId) {
      const entityAttributes = await this.entityAttributeRepository.findAll({
        where: {
          entityTypeId: filter.entityTypeId,
        },
      });
      const attributeIds = entityAttributes.map(
        (entityAttribute) => entityAttribute.attributeId,
      );
      builder = builder.filter({
        id: {
          [Op.in]: attributeIds,
        },
      });
    }
    const count = await this.repository.count(builder.build());
    return {
      result: await this.repository.findAll(
        builder
          .limit(filter.limit, filter.ignorePaging)
          .offset(filter.offset, filter.ignorePaging)
          .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
          .build(),
      ),
      total: count,
    };
  }

  async findById(id: bigint) {
    let builder = new QueryOptionsBuilder();
    const options = builder
      .filter({
        id,
      })
      .build();
    const attribute = await this.repository.findOne(options);
    if (!attribute) throw new NotFoundException();
    return {
      result: attribute,
    };
  }
  async create(dto: AttributeDto) {
    const attributeType = await this.attributeTypeRepository.findOne({
      where: {
        id: dto.attributeTypeId,
      },
    });
    if (!attributeType)
      throw new ForbiddenException('the given attributeTypeId not founded!');
    const entityType = await this.entityTypeRepository.findOne({
      where: {
        id: dto.entityTypeId,
      },
    });
    if (!entityType)
      throw new ForbiddenException('the given entityTypeId not founded!');
    const mappedItem = this.mapper.map(dto, AttributeDto, EAVAttribute);
    const attribute = await this.repository.create(mappedItem.toJSON());
    let attributeEntity = await this.entityAttributeRepository.create({
      attributeId: attribute.id,
      entityTypeId: dto.entityTypeId,
    });
    const options = new QueryOptionsBuilder()
      .filter({
        attributeId: attributeEntity.id,
      })
      .filter({ entityTypeId: attributeEntity.entityTypeId })
      .include({
        include: [
          {
            model: EAVAttribute,
            as: 'attribute',
          },
          {
            model: EAVEntityType,
            as: 'entityType',
          },
        ],
      })
      .build();
    attributeEntity = await this.entityAttributeRepository.findOne(options);
    return {
      result: attributeEntity,
    };
  }
}
