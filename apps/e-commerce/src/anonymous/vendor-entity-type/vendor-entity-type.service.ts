import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { EAVEntityType } from '@rahino/localdatabase/models';
import { GetEntityTypeDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { EAVEntityModel } from '@rahino/localdatabase/models';
import * as _ from 'lodash';
import { Attachment } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { PublishStatusEnum } from '@rahino/ecommerce/client/product/enum';
import { InventoryStatusEnum } from '@rahino/ecommerce/shared/inventory/enum';

@Injectable()
export class VendorEntityTypeService {
  constructor(
    @InjectModel(EAVEntityType)
    private readonly repository: typeof EAVEntityType,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(filter: GetEntityTypeDto) {
    let builder = new QueryOptionsBuilder()
      .filter({
        name: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('EAVEntityType.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filterIf(filter.entityModelId != null, {
        entityModelId: filter.entityModelId,
      })
      .filterIf(filter.parentEntityTypeId != null, {
        parentEntityTypeId: filter.parentEntityTypeId,
      })
      .filterIf(filter.ignoreChilds == true, {
        parentEntityTypeId: {
          [Op.is]: null,
        },
      })
      .filter(
        Sequelize.literal(
          ` EXISTS (
        SELECT 1 
        FROM ECProducts EP 
        LEFT JOIN ECInventories EI 
        ON EP.id = EI.productId
        LEFT JOIN EAVEntityTypes EPET2
        ON EPET2.parentEntityTypeId = EAVEntityType.id
        LEFT JOIN EAVEntityTypes EPET3
        ON EPET3.parentEntityTypeId = EPET2.id
        WHERE ISNULL(EP.isDeleted, 0) = 0 
         AND EP.publishStatusId = ${PublishStatusEnum.publish}
         AND EP.inventoryStatusId = ${InventoryStatusEnum.available}
         AND ISNULL(EI.isDeleted, 0) = 0 
         AND EP.entityTypeId IN (EAVEntityType.id, EPET2.id, EPET3.id) 
         AND EI.vendorId = ${filter.vendorId}
         AND ${
           filter.inventoryStatusId
             ? 'EI.inventoryStatusId = ' + filter.inventoryStatusId.toString()
             : '1=1'
         }
        )`.replaceAll(/\s\s+/g, ' '),
        ),
      );

    const count = await this.repository.count(builder.build());

    builder = builder
      .include([
        {
          attributes: ['id', 'fileName'],
          model: Attachment,
          as: 'attachment',
          required: false,
        },
        {
          attributes: ['id', 'name'],
          model: EAVEntityModel,
          as: 'entityModel',
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'parentEntityType',
          required: false,
          include: [
            {
              attributes: ['id', 'fileName'],
              model: Attachment,
              as: 'attachment',
              required: false,
            },
          ],
        },
        {
          attributes: ['id', 'name', 'slug'],
          model: EAVEntityType,
          as: 'subEntityTypes',
          required: false,
          where: {
            [Op.and]: [
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('subEntityTypes.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
              Sequelize.literal(
                ` EXISTS (
              SELECT 1 
              FROM ECProducts EP 
              LEFT JOIN ECInventories EI 
              ON EP.id = EI.productId 
              LEFT JOIN EAVEntityTypes EPET2
              ON EPET2.parentEntityTypeId = subEntityTypes.id
              WHERE ISNULL(EP.isDeleted, 0) = 0 
               AND EP.publishStatusId = ${PublishStatusEnum.publish}
               AND EP.inventoryStatusId = ${InventoryStatusEnum.available} 
               AND ISNULL(EI.isDeleted, 0) = 0 
               AND EP.entityTypeId IN (subEntityTypes.id, EPET2.id)
               AND EI.vendorId = ${filter.vendorId}
               AND ${
                 filter.inventoryStatusId
                   ? 'EI.inventoryStatusId = ' +
                     filter.inventoryStatusId.toString()
                   : '1=1'
               }
              )`.replaceAll(/\s\s+/g, ' '),
              ),
            ],
          },
          include: [
            {
              attributes: ['id', 'name', 'slug'],
              model: EAVEntityType,
              as: 'subEntityTypes',
              required: false,
              where: {
                [Op.and]: [
                  Sequelize.where(
                    Sequelize.fn(
                      'isnull',
                      Sequelize.col('subEntityTypes.subEntityTypes.isDeleted'),
                      0,
                    ),
                    {
                      [Op.eq]: 0,
                    },
                  ),
                  Sequelize.literal(
                    ` EXISTS (
                    SELECT 1 
                    FROM ECProducts EP 
                    LEFT JOIN ECInventories EI 
                    ON EP.id = EI.productId 
                    WHERE ISNULL(EP.isDeleted, 0) = 0 
                    AND EP.publishStatusId = ${PublishStatusEnum.publish}
                    AND EP.inventoryStatusId = ${InventoryStatusEnum.available}
                    AND ISNULL(EI.isDeleted, 0) = 0 
                    AND [subEntityTypes->subEntityTypes].id = EP.entityTypeId
                    AND EI.vendorId = ${filter.vendorId}
                    AND ${
                      filter.inventoryStatusId
                        ? 'EI.inventoryStatusId = ' +
                          filter.inventoryStatusId.toString()
                        : '1=1'
                    }
                    )`.replaceAll(/\s\s+/g, ' '),
                  ),
                ],
              },
              include: [
                {
                  attributes: ['id', 'fileName'],
                  model: Attachment,
                  as: 'attachment',
                  required: false,
                },
              ],
            },
            {
              attributes: ['id', 'fileName'],
              model: Attachment,
              as: 'attachment',
              required: false,
            },
          ],
        },
      ])
      .attributes([
        'id',
        'name',
        'slug',
        'parentEntityTypeId',
        'entityModelId',
        'priority',
        'showLanding',
        'isDeleted',
        'createdAt',
        'updatedAt',
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.repository.findAll(builder.build()),
      total: count,
    };
  }
}
