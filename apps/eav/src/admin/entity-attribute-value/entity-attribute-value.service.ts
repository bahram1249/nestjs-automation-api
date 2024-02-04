import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityAttributeValueDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/database/models/eav/eav-entity-type.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';
import { EAVEntityAttribute } from '@rahino/database/models/eav/eav-entity-attribute.entity';
import { EAVAttribute } from '@rahino/database/models/eav/eav-attribute.entity';
import { EAVAttributeValue } from '@rahino/database/models/eav/eav-attribute-value';
import { EAVEntityAttributeValue } from '@rahino/database/models/eav/eav-entity-attribute-value.entity';

@Injectable()
export class EntityAttributeValueService {
  constructor(
    @InjectModel(EAVEntityType)
    private readonly entityTypeRepository: typeof EAVEntityType,
    @InjectModel(EAVEntityAttribute)
    private readonly entityAttributeRepository: typeof EAVEntityAttribute,
    @InjectModel(EAVAttributeValue)
    private readonly attributeValueRepository: typeof EAVAttributeValue,
    @InjectModel(EAVEntityAttributeValue)
    private entityAttributeValueRepository: typeof EAVEntityAttributeValue,
    @InjectModel(EAVAttribute)
    private attributeRepository: typeof EAVAttribute,
  ) {}

  async validation(
    entityTypeId: number,
    entityAttributes?: EntityAttributeValueDto[],
  ) {
    await this.entityTypeValidation(entityTypeId);

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
    await this.allowAttributeValidation(entityTypeAttributes, entityAttributes);

    // check required field
    await this.requiredAttributeValidation(
      entityTypeAttributes,
      entityAttributes,
    );

    // check type value based
    await this.valueBaseAttributeValidation(
      entityTypeAttributes,
      entityAttributes,
    );
  }

  private async valueBaseAttributeValidation(
    entityTypeAttributes: EAVEntityAttribute[],
    entityAttributes?: EntityAttributeValueDto[],
  ) {
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

  private async requiredAttributeValidation(
    entityTypeAttributes: EAVEntityAttribute[],
    entityAttributes?: EntityAttributeValueDto[],
  ) {
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
  }

  private async allowAttributeValidation(
    entityTypeAttributes: EAVEntityAttribute[],
    entityAttributes?: EntityAttributeValueDto[],
  ) {
    entityAttributes.forEach((entityAttribute) => {
      const findItem = entityTypeAttributes.find(
        (item) => item.attributeId == entityAttribute.id,
      );
      if (!findItem)
        throw new BadRequestException(
          `the attributeId:${entityAttribute.id} you send it is not founded in selected type`,
        );
    });
  }

  private async entityTypeValidation(entityTypeId: number) {
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
  }

  async insert(entityId: bigint, entityAttributes?: EntityAttributeValueDto[]) {
    const valueBasedType = [3];
    entityAttributes.forEach(async (attribute) => {
      const findAttribute = await this.attributeRepository.findOne(
        new QueryOptionsBuilder()
          .filter(
            Sequelize.where(
              Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .filter({ id: attribute.id })
          .build(),
      );
      if (!findAttribute) {
        throw new BadRequestException(
          `the given attributeId->${findAttribute.id}:${findAttribute.name} is not founded !`,
        );
      }
      if (
        valueBasedType.findIndex(
          (itemId) => itemId == findAttribute.attributeTypeId,
        ) > -1
      ) {
        await this.entityAttributeValueRepository.create({
          entityId: entityId,
          attributeId: attribute.id,
          attributeValueId: attribute.val,
        });
      } else {
        await this.entityAttributeValueRepository.create({
          entityId: entityId,
          attributeId: attribute.id,
          val: attribute.val,
        });
      }
    });
  }
}