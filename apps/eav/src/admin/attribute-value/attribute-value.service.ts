import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { AttributeValueDto, GetAttributeValueDto } from './dto';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVAttributeValue } from '@rahino/database/models/eav/eav-attribute-value';

@Injectable()
export class AttributeValueService {
  private attributeValueBaseTypes: number[] = [3];
  constructor(
    @InjectModel(EAVAttributeValue)
    private readonly repository: typeof EAVAttributeValue,
    @InjectModel(EAVAttribute)
    private readonly attributeRepository: typeof EAVAttribute,
    @InjectMapper() private readonly mapper: Mapper,
  ) {}

  async findAll(filter: GetAttributeValueDto) {
    let builder = new QueryOptionsBuilder();
    builder = builder.filter({
      value: {
        [Op.like]: filter.search,
      },
    });
    if (filter.attributeId) {
      builder = builder.filter({ attributeId: filter.attributeId });
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
    const attributeValue = await this.repository.findOne(options);
    if (!attributeValue) {
      throw new NotFoundException('the item with this given id not founded!');
    }

    return {
      result: attributeValue,
    };
  }

  async create(dto: AttributeValueDto) {
    const attribute = await this.attributeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.attributeId })
        .filter({
          attributeTypeId: {
            [Op.in]: this.attributeValueBaseTypes,
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
    if (!attribute) {
      throw new ForbiddenException('the given attributeId not founded!');
    }

    const mappedItem = this.mapper.map(
      dto,
      AttributeValueDto,
      EAVAttributeValue,
    );
    const attributeValue = await this.repository.create(mappedItem.toJSON());

    return {
      result: attributeValue,
    };
  }

  async updateById(id: bigint, dto: AttributeValueDto) {
    const item = await this.repository.findOne(
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

    const attribute = await this.attributeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: dto.attributeId })
        .filter({
          attributeTypeId: {
            [Op.in]: this.attributeValueBaseTypes,
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
    if (!attribute) {
      throw new ForbiddenException('the given attributeId not founded!');
    }

    const mappedItem = this.mapper.map(
      dto,
      AttributeValueDto,
      EAVAttributeValue,
    );
    const attributeValue = await this.repository.update(mappedItem.toJSON(), {
      where: { id },
      returning: true,
    });

    return {
      result: attributeValue,
    };
  }

  async deleteById(entityId: bigint) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
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
