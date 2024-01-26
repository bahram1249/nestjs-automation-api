import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityAttributeValueDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { EAVEntityAttribute } from '@rahino/database/models/eav/eav-entity-attribute.entity';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVAttributeValue } from '@rahino/database/models/eav/eav-attribute-value';

@Injectable()
export class EntityAttributeValueService {
  constructor(
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectModel(EAVEntityAttribute)
    private readonly entityAttributeRepository: typeof EAVEntityAttribute,
    @InjectModel(EAVAttributeValue)
    private readonly attributeValueRepository: typeof EAVAttributeValue,
  ) {}

  async validation(
    entityTypeId: number,
    entityAttributes?: EntityAttributeValueDto[],
  ) {
    const entityType = await this.entityTypeRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityTypeId })
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
    if (!entityType) {
      throw new BadRequestException('the given entityTypeId is not founded !');
    }
    const entityTypeAttributes = await this.entityAttributeRepository.findAll(
      new QueryOptionsBuilder()
        .filter({ entityTypeId: entityTypeId })
        .include([
          {
            model: EAVAttribute,
            as: 'attribute',
          },
        ])
        .build(),
    );

    // check if the attribute send it is not found in this type
    entityAttributes.forEach((entityAttribute) => {
      const findItem = entityTypeAttributes.find(
        (item) => item.attributeId == entityAttribute.id,
      );
      if (!findItem)
        throw new BadRequestException(
          `the attributeId:${entityAttribute.id} you send it is not founded in selected type`,
        );
    });

    // check required field
    const requiredAttributes = entityTypeAttributes.filter(
      (entityTypeAttribute) => entityTypeAttribute.attribute.required == true,
    );

    requiredAttributes.forEach((requiredAttribute) => {
      const findItem = entityAttributes.find(
        (entityAttribute) =>
          entityAttribute.id == requiredAttribute.attributeId,
      );
      if (!findItem) {
        throw new BadRequestException(
          `the attribute: ${requiredAttribute.attributeId}:${requiredAttribute.attribute.name} is required!`,
        );
      }
    });

    // check type value based
    const valueBasedAttributeIds = [3];
    const valueBasedAttributes = entityTypeAttributes.filter(
      (entityTypeAttribute) =>
        valueBasedAttributeIds.findIndex(
          (item) => item == entityTypeAttribute.attribute.attributeTypeId,
        ) != -1,
    );
    valueBasedAttributes.forEach(async (valueBasedAttribute) => {
      const findItem = entityAttributes.find(
        (entityAttribute) =>
          entityAttribute.id == valueBasedAttribute.attributeId,
      );
      const attributeValue = await this.attributeValueRepository.findOne(
        new QueryOptionsBuilder()
          .filter({
            attributeId: findItem.id,
          })
          .filter({
            id: findItem.val,
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
      if (!attributeValue) {
        throw new BadRequestException(
          `the given attributeValueId-> ${findItem.val} for attribute ${valueBasedAttribute.attribute.name} is not valid !`,
        );
      }
    });
  }
  async insert(
    entityId: bigint,
    entityAttributes?: EntityAttributeValueDto[],
  ) {}
}
