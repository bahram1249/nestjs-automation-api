import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { LogisticWeeklyPeriodDto, GetLogistiWeeklyPeriodDto } from './dto';
import {
  ECLogisticSendingPeriod,
  ECLogisticWeeklyPeriod,
  ECLogisticWeeklyPeriodTime,
} from '@rahino/localdatabase/models';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
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
    @InjectConnection()
    private readonly sequelize: Sequelize,
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
          as: 'weeklyPeriodTimes',
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
          as: 'weeklyPeriodTimes',
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
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const logisticSendingPeriod =
        await this.logisticSendingPeriodRepository.findOne(
          new QueryOptionsBuilder()
            .filter({
              id: dto.logisticSendingPeriodId,
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
            .transaction(transaction)
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
            .transaction(transaction)
            .build(),
        );

      if (oldLogisticWeeklyPeriodMustDeleted.length > 0) {
        await this.logisticWeeklyPeriodRepository.update(
          { isDeleted: true },

          {
            where: {
              id: {
                [Op.in]: oldLogisticWeeklyPeriodMustDeleted.map(
                  (item) => item.id,
                ),
              },
            },
            transaction: transaction,
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
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return await this.findAll(user, {
      logisticSendingPeriodId: dto.logisticSendingPeriodId,
    });
  }

  async createOrUpdateLogisticWeeklyPeriod(
    logisticSendingPeriodId: number,
    dto: LogisticWeeklyPeriodDetailDto,
    transaction?: Transaction,
  ) {
    if (isNotNull(dto.id)) {
      return await this.updateLogisticWeeklyPeriod(
        dto,
        logisticSendingPeriodId,
        transaction,
      );

      // create or update logisticWeeklyPeriodTimes
    }
    return await this.createLogisticWeeklyPeriod(
      logisticSendingPeriodId,
      dto,
      transaction,
    );
  }

  async updateLogisticWeeklyPeriod(
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
      where: { id: dto.id },
      transaction,
    });

    const logisticWeeklyPeriodTimeIds = dto.logisticWeeklyPeriodTimes?.map(
      (item) => item.id,
    );

    const filteredLogisticWeeklyPeriodTimeIds =
      logisticWeeklyPeriodTimeIds?.filter((id) => isNotNull(id));

    const queryBuilderForTimes = new QueryOptionsBuilder().filter({
      logisticWeeklyPeriodId: dto.id,
    });

    if (
      filteredLogisticWeeklyPeriodTimeIds &&
      filteredLogisticWeeklyPeriodTimeIds.length > 0
    ) {
      queryBuilderForTimes.filter({
        id: {
          [Op.notIn]: filteredLogisticWeeklyPeriodTimeIds,
        },
      });
    }

    const oldLogisticWeeklyPeriodTimesMustDeleted =
      await this.logisticWeeklyPeriodTimeRepository.findAll(
        queryBuilderForTimes.transaction(transaction).build(),
      );

    if (oldLogisticWeeklyPeriodTimesMustDeleted.length > 0) {
      await this.logisticWeeklyPeriodTimeRepository.update(
        { isDeleted: true },
        {
          where: {
            id: {
              [Op.in]: oldLogisticWeeklyPeriodTimesMustDeleted.map(
                (item) => item.id,
              ),
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
          dto.id as any,
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

    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
    insertedItem.logisticWeeklyPeriodId = logisticWeeklyPeriodId;

    await this.logisticWeeklyPeriodTimeRepository.create(insertedItem, {
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
    //updatedItem.logisticWeeklyPeriodId = logisticWeeklyPeriodId;

    await this.logisticWeeklyPeriodTimeRepository.update(updatedItem, {
      where: {
        id: dto.id,
      },
      transaction: transaction,
    });
  }
}
