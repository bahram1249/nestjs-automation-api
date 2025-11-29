import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLogisticShipmentWayDto, GetLogisticShipmentWayDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import * as _ from 'lodash';
import {
  ECLogistic,
  ECLogisticShipmentWay,
  ECOrderShipmentWay,
  ECProvince,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LogisticUserRoleHandlerService } from '../logistic-user-role-handler/logistic-user-role-handler.service';

@Injectable()
export class AdminLogisticShipmentWayService {
  constructor(
    @InjectModel(ECLogisticShipmentWay)
    private readonly logisticShipmentWayRepository: typeof ECLogisticShipmentWay,

    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly localizationService: LocalizationService,
    private readonly logisticUserRoleHandlerService: LogisticUserRoleHandlerService,
  ) {}

  async findAll(
    user: User,
    logisticId: bigint,
    filter: GetLogisticShipmentWayDto,
  ) {
    await this.logisticUserRoleHandlerService.checkAccessToLogistic({
      logisticId: logisticId,
      user,
    });

    let queryBuilder = new QueryOptionsBuilder()

      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('ECLogisticShipmentWay.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      )
      .filter({ logisticId: logisticId });

    const count = await this.logisticShipmentWayRepository.count(
      queryBuilder.build(),
    );

    queryBuilder = queryBuilder
      .attributes(['id', 'provinceId', 'logisticId', 'orderShipmentWayId'])
      .include([
        { model: ECProvince, as: 'province', attributes: ['id', 'name'] },
        {
          model: ECOrderShipmentWay,
          as: 'orderShipmentWay',
          attributes: ['id', 'name', 'isPeriodic'],
        },
        { model: ECLogistic, as: 'logistic', attributes: ['id', 'title'] },
      ])
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.logisticShipmentWayRepository.findAll(
      queryBuilder.build(),
    );

    return {
      result: result,
      total: count,
    };
  }

  async create(user: User, dto: CreateLogisticShipmentWayDto) {
    await this.logisticUserRoleHandlerService.checkAccessToLogistic({
      user: user,
      logisticId: dto.logisticId,
    });

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      const excludeConditions = dto.shipmentWayDetails.map((pair) => ({
        [Op.and]: [
          { orderShipmentWayId: pair.orderShipmentWayId },
          { provinceId: pair.provinceId },
        ],
      }));

      const oldItemsThatNotExists =
        await this.logisticShipmentWayRepository.findAll(
          new QueryOptionsBuilder()
            .filter({ logisticId: dto.logisticId })
            .filter(
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('ECLogisticShipmentWay.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            )
            .filter({
              [Op.not]: {
                [Op.or]: excludeConditions,
              },
            })
            .transaction(transaction)
            .build(),
        );

      if (oldItemsThatNotExists.length > 0) {
        await this.logisticShipmentWayRepository.update(
          { isDeleted: true },
          {
            where: { id: oldItemsThatNotExists.map((item) => item.id) },
            transaction: transaction,
          },
        );
      }

      await this.createOrSkip(dto, transaction);
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return {
      result: this.localizationService.translate('core.success'),
    };
  }

  private async createOrSkip(
    dto: CreateLogisticShipmentWayDto,
    transaction?: Transaction,
  ) {
    await Promise.all(
      dto.shipmentWayDetails.map(async (shipmentWayDetail) => {
        const findItem = await this.logisticShipmentWayRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ logisticId: dto.logisticId })
            .filter({ provinceId: shipmentWayDetail.provinceId })
            .filter({
              orderShipmentWayId: shipmentWayDetail.orderShipmentWayId,
            })
            .filter(
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('ECLogisticShipmentWay.isDeleted'),
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
        if (!findItem) {
          // create
          await this.logisticShipmentWayRepository.create(
            {
              ...shipmentWayDetail,
              logisticId: dto.logisticId,
            },
            {
              transaction: transaction,
            },
          );
        }
      }),
    );
  }
}
