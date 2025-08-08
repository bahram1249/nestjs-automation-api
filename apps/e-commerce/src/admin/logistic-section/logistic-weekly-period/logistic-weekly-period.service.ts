import { BadRequestException, Injectable } from '@nestjs/common';
import { LogisticWeeklyPeriodDto, GetLogistiWeeklyPeriodDto } from './dto';
import {
  ECLogisticSendingPeriod,
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
} from '@rahino/localdatabase/models';
import { InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import * as _ from 'lodash';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { isNotNull } from '@rahino/commontools';
import { LogisticWeeklyPeriodDetailDto } from './dto/logistic-weekly-period-detail.dto';
import { LogisticWeeklyPeriodTimeDto } from './dto/logistic-weekly-period-time.dto';

@Injectable()
export class LogisticWeeklyPeriodService {
  constructor(
    @InjectModel(ECLogisticSendingPeriod)
    private readonly logisticSendingPeriodRepository: typeof ECLogisticSendingPeriod,
    @InjectModel(ECLogisticWeeklyPeriod)
    private readonly logisticWeeklyPeriodRepository: typeof ECLogisticWeeklyPeriod,
    @InjectModel(ECLogisticWeeklyPeriodTime)
    private readonly logisticWeeklyPeriodTimeRepository: typeof ECLogisticWeeklyPeriodTime,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly localizationService: LocalizationService,
  ) {}

  async findAll(user: User, filter: GetLogistiWeeklyPeriodDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .filter({
        logisticSendingPeriodId: filter.logisticSendingPeriodId,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticWeeklyPeriod.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );
    const count = await this.logisticWeeklyPeriodRepository.count(
      queryBuilder.build(),
    );
    queryBuilder = queryBuilder
      .attributes(['id', 'logisticSendingPeriodId', 'weekNumber'])
      .include([
        {
          model: ECLogisticWeeklyPeriodTime,
          as: 'logisticWeeklyPeriodTimes',
          where: {
            isDeleted: {
              [Op.eq]: null,
            },
          },
        },
      ]);

    const result = await this.logisticWeeklyPeriodRepository.findAll(
      queryBuilder.build(),
    );
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: bigint, user: User, transaction?: Transaction) {
    const queryBuilder = new QueryOptionsBuilder()
      .attributes(['id', 'logisticSendingPeriodId', 'weekNumber'])
      .include([
        {
          model: ECLogisticWeeklyPeriodTime,
          as: 'logisticWeeklyPeriodTimes',
          where: {
            isDeleted: {
              [Op.eq]: null,
            },
          },
        },
      ])
      .filter({
        id: entityId,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticWeeklyPeriod.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const item = await this.logisticWeeklyPeriodRepository.findOne(
      queryBuilder.build(),
    );
    if (!item) {
      await this.localizationService.translate('core.not_found_id');
    }

    return {
      result: item,
    };
  }

  async create(user: User, dto: LogisticWeeklyPeriodDto) {
    let transaction: Transaction = null;
    const logisticSendingPeriod =
      await this.logisticSendingPeriodRepository.findOne(
        new QueryOptionsBuilder()
          .filter({
            logisticSendingPeriodId: dto.logisticSendingPeriodId,
          })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECLogisticSendingPeriod.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .build(),
      );

    if (!logisticSendingPeriod) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const oldLogisticWeeklyPeriodIds = dto.logisticWeeklyPeriods
      ?.filter((item) => isNotNull(item.id))
      .map((logisticWeeklyPeriod) => logisticWeeklyPeriod.id);

    const oldLogisticWeeklyPeriodMustDeleted =
      await this.logisticWeeklyPeriodRepository.findAll(
        new QueryOptionsBuilder()
          .filter({
            logisticSendingPeriodId: dto.logisticSendingPeriodId,
          })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECLogisticWeeklyPeriod.isDeleted'),
                0,
              ),
              {
                [Op.eq]: 0,
              },
            ),
          )
          .filter({
            id: {
              [Op.notIn]: oldLogisticWeeklyPeriodIds,
            },
          })
          .build(),
      );

    if (oldLogisticWeeklyPeriodMustDeleted.length > 0) {
      await this.logisticWeeklyPeriodRepository.update(
        { isDeleted: 1 },
        {
          where: {
            id: {
              [Op.in]: oldLogisticWeeklyPeriodMustDeleted.map(
                (item) => item.id,
              ),
            },
          },
        },
      );
    }

    await Promise.all(
      dto.logisticWeeklyPeriods?.map(async (logisticWeeklyPeriod) => {
        await this.createOrUpdateLogisticWeeklyPeriod(
          dto.logisticSendingPeriodId,
          logisticWeeklyPeriod,
          transaction,
        );
      }),
    );

    return await this.findAll(user, {
      logisticSendingPeriodId: dto.logisticSendingPeriodId,
    });
  }

  async createOrUpdateLogisticWeeklyPeriod(
    logisticWeeklyPeriodId: number,
    dto: LogisticWeeklyPeriodDetailDto,
    transaction?: Transaction,
  ) {
    if (isNotNull(dto.id)) {
      return await this.updateLogisticWeeklyPeriod(
        dto.id,
        dto,
        logisticWeeklyPeriodId,
        transaction,
      );

      // create or update logisticWeeklyPeriodTimes
    }
    return await this.createLogisticWeeklyPeriod(
      logisticWeeklyPeriodId,
      dto,
      transaction,
    );
  }

  async updateLogisticWeeklyPeriod(
    id: number,
    dto: LogisticWeeklyPeriodDetailDto,
    logisticSendingPeriodId: number,
    transaction: Transaction,
  ) {
    const mappedItem = this.mapper.map(
      dto,
      LogisticWeeklyPeriodDetailDto,
      ECLogisticWeeklyPeriod,
    );

    const updateItem = _.omit(mappedItem.toJSON());
    updateItem.logisticSendingPeriodId = logisticSendingPeriodId;

    await this.logisticWeeklyPeriodRepository.update(updateItem, {
      where: { id: updateItem.id },
      transaction,
    });

    const logisticWeeklyPeriodTimeIds = dto.logisticWeeklyPeriodTimes?.map(
      (item) => item.id,
    );

    const oldLogisticWeeklyPeriodTimesMustDeleted =
      await this.logisticWeeklyPeriodTimeRepository.findAll(
        new QueryOptionsBuilder()
          .filter({
            id: {
              [Op.notIn]: logisticWeeklyPeriodTimeIds,
            },
          })
          .transaction(transaction)
          .build(),
      );

    if (oldLogisticWeeklyPeriodTimesMustDeleted.length > 0) {
      await this.logisticWeeklyPeriodTimeRepository.update(
        { isDeleted: true },
        {
          where: {
            id: {
              [Op.in]: oldLogisticWeeklyPeriodTimesMustDeleted,
            },
          },
          transaction: transaction,
        },
      );
    }
    // create or update logistic weekly period times
    await Promise.all(
      dto.logisticWeeklyPeriodTimes?.map(async (item) => {
        await this.createOrUpdateLogisticWeeklyPeriodTimes(
          updateItem.id,
          item,
          transaction,
        );
      }),
    );
  }

  async createLogisticWeeklyPeriod(
    logisticSendingPeriodId: number,
    dto: LogisticWeeklyPeriodDetailDto,
    transaction: Transaction,
  ) {
    const mappedItem = this.mapper.map(
      dto,
      LogisticWeeklyPeriodDetailDto,
      ECLogisticWeeklyPeriod,
    );

    const insertItem = _.omit(mappedItem.toJSON(), ['id']);
    insertItem.logisticSendingPeriodId = logisticSendingPeriodId;

    const logisticWeeklyPeriod =
      await this.logisticWeeklyPeriodRepository.create(insertItem, {
        transaction,
      });

    // insert logisticWeeklyPeriodTimes
    await Promise.all(
      dto.logisticWeeklyPeriodTimes?.map(async (logisticWeeklyPeriodTime) => {
        await this.createLogisticWeeklyPeriodTime(
          logisticWeeklyPeriod.id,
          logisticWeeklyPeriodTime,
          transaction,
        );
      }),
    );
  }

  private async createOrUpdateLogisticWeeklyPeriodTimes(
    logisticWeeklyPeriodId: bigint,
    dto: LogisticWeeklyPeriodTimeDto,
    transaction?: Transaction,
  ) {
    if (isNotNull(dto.id)) {
      return await this.updateLogisticWeeklyPeriodTime(
        logisticWeeklyPeriodId,
        dto,
        transaction,
      );
    }
    return await this.createLogisticWeeklyPeriodTime(
      logisticWeeklyPeriodId,
      dto,
      transaction,
    );
  }

  private async createLogisticWeeklyPeriodTime(
    logisticWeeklyPeriodId: bigint,
    dto: LogisticWeeklyPeriodTimeDto,
    transaction?: Transaction,
  ) {
    const mappedItem = this.mapper.map(
      dto,
      LogisticWeeklyPeriodTimeDto,
      ECLogisticWeeklyPeriodTime,
    );

    const insetedItem = _.omit(mappedItem.toJSON(), ['id']);
    insetedItem.logisticWeeklyPeriodId = logisticWeeklyPeriodId;

    await this.logisticWeeklyPeriodTimeRepository.create(insetedItem, {
      transaction: transaction,
    });
  }

  private async updateLogisticWeeklyPeriodTime(
    logisticWeeklyPeriodId: bigint,
    dto: LogisticWeeklyPeriodTimeDto,
    transaction?: Transaction,
  ) {
    const mappedItem = this.mapper.map(
      dto,
      LogisticWeeklyPeriodTimeDto,
      ECLogisticWeeklyPeriodTime,
    );

    const updatedItem = _.omit(mappedItem.toJSON());
    updatedItem.logisticWeeklyPeriodId = logisticWeeklyPeriodId;

    await this.logisticWeeklyPeriodTimeRepository.create(updatedItem, {
      where: {
        id: dto.id,
      },
      transaction: transaction,
    });
  }
}
