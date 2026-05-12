import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LogisticSendingPeriodDto, GetLogisticSendingPeriodDto } from './dto';
import {
  ECLogisticSendingPeriod,
  ECLogisticShipmentWay,
  ECScheduleSendingType,
} from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { PermissionService } from '@rahino/core/user/permission/permission.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { isNotNull } from '@rahino/commontools';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class LogisticSendingPeriodService {
  constructor(
    @InjectModel(ECLogisticSendingPeriod)
    private readonly repository: typeof ECLogisticSendingPeriod,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly localizationService: LocalizationService,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(user: User, filter: GetLogisticSendingPeriodDto) {
    const queryBuilder = new QueryOptionsBuilder().filterIf(
      isNotNull(filter.logisticShipmentWayId),
      { logisticShipmentWayId: filter.logisticShipmentWayId },
    );
    const count = await this.repository.count(queryBuilder.build());
    const queryOptions = queryBuilder
      .attributes([
        'id',
        'logisticShipmentWayId',
        'scheduleSendingTypeId',
        'startDate',
        'endDate',
      ])
      .include([
        {
          model: ECLogisticShipmentWay,
          as: 'shipmentWay',
        },
        {
          model: ECScheduleSendingType,
          as: 'scheduleSendingType',
        },
      ])
      .filter(
        this.seqHelp.whereIsNullColumnEqualToZero(
          'ECLogisticSendingPeriod.isDeleted',
          0,
        ),
      )

      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();
    const result = await this.repository.findAll(queryOptions);
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: bigint, user: User, transaction?: Transaction) {
    const queryBuilder = new QueryOptionsBuilder()
      .attributes([
        'id',
        'logisticShipmentWayId',
        'scheduleSendingTypeId',
        'startDate',
        'endDate',
      ])
      .include([
        {
          model: ECLogisticShipmentWay,
          as: 'shipmentWay',
        },
        {
          model: ECScheduleSendingType,
          as: 'scheduleSendingType',
        },
      ])
      .filter({
        id: entityId,
      })
      .filter(
        this.seqHelp.whereIsNullColumnEqualToZero(
          'ECLogisticSendingPeriod.isDeleted',
          0,
        ),
      );

    const item = await this.repository.findOne(queryBuilder.build());
    if (!item) {
      await this.localizationService.translate('core.not_found_id');
    }

    return {
      result: item,
    };
  }

  async create(user: User, dto: LogisticSendingPeriodDto) {
    const mappedItem = this.mapper.map(
      dto,
      LogisticSendingPeriodDto,
      ECLogisticSendingPeriod,
    );

    const existsInAnotherPeriod = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          logisticShipmentWayId: dto.logisticShipmentWayId,
        })
        .filter({ scheduleSendingTypeId: dto.scheduleSendingTypeId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero(
            'ECLogisticSendingPeriod.isDeleted',
            0,
          ),
        )
        .filter({
          [Op.or]: [
            Sequelize.where(
              this.seqHelp.isnull(
                Sequelize.literal(dto.startDate ? `'${dto.startDate}'` : null),
                this.seqHelp.getDate(),
              ),
              {
                [Op.between]: [
                  this.seqHelp.isnullColumnWithCurrentDate(
                    'ECLogisticSendingPeriod.startDate',
                  ),
                  this.seqHelp.isnullColumnWithCurrentDate(
                    'ECLogisticSendingPeriod.endDate',
                  ),
                ],
              },
            ),
            Sequelize.where(
              this.seqHelp.isnull(
                Sequelize.literal(dto.endDate ? `'${dto.endDate}'` : null),
                this.seqHelp.getDate(),
              ),
              {
                [Op.between]: [
                  this.seqHelp.isnullColumnWithCurrentDate(
                    'ECLogisticSendingPeriod.startDate',
                  ),
                  this.seqHelp.isnullColumnWithCurrentDate(
                    'ECLogisticSendingPeriod.endDate',
                  ),
                ],
              },
            ),
          ],
        })
        .build(),
    );

    if (existsInAnotherPeriod) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.cannot_defined_this_period_becuase_another_period_defined_between_this_time',
        ),
      );
    }

    // To Do: Check If logisticShipmentWayId is periodic or not

    const insertItem = _.omit(mappedItem.toJSON(), ['id']);
    const item = await this.repository.create(insertItem);
    return {
      result: item,
    };
  }

  async update(entityId: bigint, dto: LogisticSendingPeriodDto, user: User) {
    const existsInAnotherPeriod = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          logisticShipmentWayId: dto.logisticShipmentWayId,
        })
        .filter({ scheduleSendingTypeId: dto.scheduleSendingTypeId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero(
            'ECLogisticSendingPeriod.isDeleted',
            0,
          ),
        )
        .filter({
          [Op.or]: [
            Sequelize.where(
              this.seqHelp.isnull(
                Sequelize.literal(dto.startDate ? `'${dto.startDate}'` : null),
                this.seqHelp.getDate(),
              ),
              {
                [Op.between]: [
                  this.seqHelp.isnullColumnWithCurrentDate(
                    'ECLogisticSendingPeriod.startDate',
                  ),
                  this.seqHelp.isnullColumnWithCurrentDate(
                    'ECLogisticSendingPeriod.endDate',
                  ),
                ],
              },
            ),
            Sequelize.where(
              this.seqHelp.isnull(
                Sequelize.literal(dto.endDate ? `'${dto.endDate}'` : null),
                this.seqHelp.getDate(),
              ),
              {
                [Op.between]: [
                  this.seqHelp.isnullColumnWithCurrentDate(
                    'ECLogisticSendingPeriod.startDate',
                  ),
                  this.seqHelp.isnullColumnWithCurrentDate(
                    'ECLogisticSendingPeriod.endDate',
                  ),
                ],
              },
            ),
          ],
        })
        .filter({
          id: {
            [Op.ne]: entityId,
          },
        })
        .build(),
    );

    if (existsInAnotherPeriod) {
      throw new BadRequestException(
        this.localizationService.translate(
          'ecommerce.cannot_defined_this_period_becuase_another_period_defined_between_this_time',
        ),
      );
    }

    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero(
            'ECLogisticSendingPeriod.isDeleted',
            0,
          ),
        )
        .build(),
    );

    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const mappedItem = this.mapper.map(
      dto,
      LogisticSendingPeriodDto,
      ECLogisticSendingPeriod,
    );

    const updateItem = _.omit(mappedItem.toJSON(), ['id']);
    await this.repository.update(updateItem, {
      where: {
        id: entityId,
      },
    });
    return await this.findById(entityId, user);
  }

  async deleteById(entityId: bigint) {
    let item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          this.seqHelp.whereIsNullColumnEqualToZero(
            'ECLogisticSendingPeriod.isDeleted',
            0,
          ),
        )
        .build(),
    );
    item.isDeleted = true;
    item = await item.save();
    return {
      result: _.pick(item, [
        'id',
        'logisticShipmentWayId',
        'scheduleSendingTypeId',
        'startDate',
        'endDate',
      ]),
    };
  }
}
