import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { AttributeDto, GetAttributeDto, UpdateAttributeDto } from './dto';
import {
  EAVAttribute,
  EAVEntityAttribute,
  EAVAttributeType,
  EAVEntityType,
  EAVAttributeValue,
} from '@rahino/localdatabase/models';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import * as _ from 'lodash';

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
    builder = builder
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVAttribute.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );
    if (filter.attributeTypeId) {
      builder = builder.filter({ attributeTypeId: filter.attributeTypeId });
    }
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
          .attributes([
            'id',
            'name',
            'attributeTypeId',
            'minLength',
            'maxLength',
            'required',
          ])
          .include([
            {
              model: EAVAttributeType,
              as: 'attributeType',
            },
            {
              model: EAVAttributeValue,
              as: 'attributeValues',
              required: false,
              where: Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('attributeValues.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            },
          ])
          .limit(filter.limit, filter.ignorePaging)
          .offset(filter.offset, filter.ignorePaging)
          .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
          .build(),
      ),
      total: count,
    };
  }

  async findById(id: bigint) {
    const options = new QueryOptionsBuilder()
      .attributes([
        'id',
        'name',
        'attributeTypeId',
        'minLength',
        'maxLength',
        'required',
      ])
      .include([
        {
          model: EAVAttributeType,
          as: 'attributeType',
        },
        {
          model: EAVAttributeValue,
          as: 'attributeValues',
          required: false,
          where: Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('attributeValues.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        },
      ])
      .filter({
        id,
      })
      .filter(
        Sequelize.where(Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0), {
          [Op.eq]: 0,
        }),
      )
      .build();
    const attribute = await this.repository.findOne(options);
    if (!attribute) {
      throw new NotFoundException('the item with this given id not founded!');
    }
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
    if (!attributeType) {
      throw new ForbiddenException('the given attributeTypeId not founded!');
    }

    const entityType = await this.entityTypeRepository.findOne({
      where: {
        id: dto.entityTypeId,
      },
    });
    if (!entityType) {
      throw new ForbiddenException('the given entityTypeId not founded!');
    }

    const mappedItem = this.mapper.map(dto, AttributeDto, EAVAttribute);
    const attribute = await this.repository.create(
      _.omit(mappedItem.toJSON(), ['id']),
    );
    let attributeEntity = await this.entityAttributeRepository.create({
      attributeId: attribute.id,
      entityTypeId: dto.entityTypeId,
    });
    const options = new QueryOptionsBuilder()
      .filter({
        attributeId: attributeEntity.attributeId,
      })
      .filter({ entityTypeId: attributeEntity.entityTypeId })
      .include([
        {
          attributes: [
            'id',
            'name',
            'attributeTypeId',
            'minLength',
            'maxLength',
            'required',
          ],
          model: EAVAttribute,
          as: 'attribute',
          include: [
            {
              model: EAVAttributeType,
              as: 'attributeType',
            },
          ],
        },
        {
          model: EAVEntityType,
          as: 'entityType',
        },
      ])
      .build();
    attributeEntity = await this.entityAttributeRepository.findOne(options);
    return {
      result: attributeEntity,
    };
  }

  async updateById(id: bigint, dto: UpdateAttributeDto) {
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

    const attributeType = await this.attributeTypeRepository.findOne({
      where: {
        id: dto.attributeTypeId,
      },
    });
    if (!attributeType) {
      throw new ForbiddenException('the given attributeTypeId not founded!');
    }

    const mappedItem = this.mapper.map(dto, UpdateAttributeDto, EAVAttribute);
    const attribute = await this.repository.update(
      _.omit(mappedItem.toJSON(), ['id']),
      {
        where: { id },
        returning: true,
      },
    );

    const options = new QueryOptionsBuilder()
      .filter({
        attributeId: attribute[1][0].id,
      })
      .include([
        {
          attributes: [
            'id',
            'name',
            'attributeTypeId',
            'minLength',
            'maxLength',
            'required',
          ],
          model: EAVAttribute,
          as: 'attribute',
          include: [
            {
              model: EAVAttributeType,
              as: 'attributeType',
            },
          ],
        },
        {
          model: EAVEntityType,
          as: 'entityType',
        },
      ])
      .build();
    const attributeEntity =
      await this.entityAttributeRepository.findOne(options);
    return {
      result: attributeEntity,
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

    await this.entityAttributeRepository.destroy({
      where: {
        attributeId: entityId,
      },
    });

    item.isDeleted = true;
    item = await item.save();
    return {
      result: _.pick(item, [
        'id',
        'name',
        'attributeTypeId',
        'minLength',
        'maxLength',
        'required',
      ]),
    };
  }
}
