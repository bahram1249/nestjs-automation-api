import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op } from 'sequelize';
import { AttributeEntityDto, GetAttributeDto } from './dto';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVEntityAttribute } from '@rahino/database/models/eav/eav-entity-attribute.entity';
import * as _ from 'lodash';

@Injectable()
export class AttributeService {
  constructor(
    @InjectModel(EAVAttribute)
    private readonly repository: typeof EAVAttribute,
    @InjectModel(EAVEntityAttribute)
    private readonly entityAttributeRepository: typeof EAVEntityAttribute,
  ) {}

  async findAll(filter: GetAttributeDto) {
    let options = QueryFilter.init();
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options.where = {
      [Op.and]: [
        {
          name: {
            [Op.like]: filter.search,
          },
        },
      ],
    };
    if (filter.entityTypeId) {
      const entityAttributes = await this.entityAttributeRepository.findAll({
        where: {
          entityTypeId: filter.entityTypeId,
        },
      });
      const attributeIds = entityAttributes.map(
        (entityAttribute) => entityAttribute.attributeId,
      );
      options.where[Op.and].push({
        id: {
          [Op.in]: attributeIds,
        },
      });
    }
    const count = await this.repository.count(options);
    options = QueryFilter.order(options, filter);
    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findById(id: bigint) {
    const attribute = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!attribute) throw new NotFoundException();
    return {
      result: attribute,
    };
  }
  async create(dto: AttributeEntityDto) {
    let requestBody = JSON.parse(JSON.stringify(dto));
    let attribute = await this.repository.create(requestBody.name);
    let attributeEntity = JSON.parse(
      JSON.stringify(
        _.pick(requestBody, ['minLength', 'maxLength', 'required']),
      ),
    );
    attributeEntity.attributeId = attribute.id;
    attributeEntity =
      await this.entityAttributeRepository.create(attributeEntity);
    return {
      result: attributeEntity,
    };
  }
}
