import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityAttributeValueDto } from './dto';
import { InjectModel } from '@nestjs/sequelize';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { EAVEntityAttribute } from '@rahino/localdatabase/models';
import { EAVAttribute } from '@rahino/localdatabase/models';
import { EAVAttributeValue } from '@rahino/localdatabase/models';
import { EAVEntityAttributeValue } from '@rahino/localdatabase/models';

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
    for (const valueBasedAttribute of valueBasedAttributes) {
      const findItem = entityAttributes.find(
        (entityAttribute) =>
          entityAttribute.id == valueBasedAttribute.attributeId,
      );
      // if is exists in database but not existing in dto, it's mean new field created on same time
      // so ignore the field
      if (!findItem) continue;
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
    }
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

  async insert(
    entityId: bigint,
    entityAttributes?: EntityAttributeValueDto[],
    transaction?: Transaction,
  ) {
    const valueBasedType = [3];
    for (const attribute of entityAttributes) {
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
        await this.entityAttributeValueRepository.create(
          {
            entityId: entityId,
            attributeId: attribute.id,
            attributeValueId: attribute.val,
          },
          {
            transaction: transaction,
          },
        );
      } else {
        await this.entityAttributeValueRepository.create(
          {
            entityId: entityId,
            attributeId: attribute.id,
            val: attribute.val,
          },
          {
            transaction: transaction,
          },
        );
      }
    }
  }

  async removeByEntityId(entityId: bigint, transaction?: Transaction) {
    await this.entityAttributeValueRepository.destroy({
      where: {
        entityId: entityId,
      },
      transaction: transaction,
    });
  }
}
