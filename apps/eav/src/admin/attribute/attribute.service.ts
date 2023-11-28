import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op } from 'sequelize';
import { AttributeDto, GetAttributeDto } from './dto';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVEntityAttribute } from '@rahino/database/models/eav/eav-entity-attribute.entity';

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
  async create(dto: AttributeDto) {
    let attribute = JSON.parse(JSON.stringify(dto));
    attribute = await this.repository.create(attribute);
    return {
      result: attribute,
    };
  }
}
