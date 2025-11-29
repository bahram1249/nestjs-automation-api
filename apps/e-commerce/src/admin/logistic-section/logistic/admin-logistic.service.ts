import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LogisticDto, GetLogisticDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECLogistic, ECLogisticUser } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { LogisticUserRoleHandlerService } from '../logistic-user-role-handler/logistic-user-role-handler.service';

@Injectable()
export class LogisticService {
  constructor(
    @InjectModel(ECLogistic)
    private readonly repository: typeof ECLogistic,
    @InjectModel(ECLogisticUser)
    private readonly logisticUserRepository: typeof ECLogisticUser,

    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly localizationService: LocalizationService,
    private readonly logisticUserRoleHandlerService: LogisticUserRoleHandlerService,
  ) {}

  async findAll(filter: GetLogisticDto) {
    let queryBuilder = new QueryOptionsBuilder()
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('ECLogistic.isDeleted'), 0),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const count = await this.repository.count(queryBuilder.build());

    queryBuilder = queryBuilder
      .attributes(['id', 'title'])
      .include([
        {
          model: ECLogisticUser,
          as: 'logisticUser',
          include: [
            {
              attributes: [
                'id',
                'firstname',
                'lastname',
                'username',
                'phoneNumber',
              ],
              model: User,
              as: 'user',
            },
          ],
          where: {
            [Op.and]: [
              {
                isDefault: true,
              },
              Sequelize.where(
                Sequelize.fn(
                  'isnull',
                  Sequelize.col('logisticUser.isDeleted'),
                  0,
                ),
                {
                  [Op.eq]: 0,
                },
              ),
            ],
          },
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const result = await this.repository.findAll(queryBuilder.build());
    return {
      result: result,
      total: count,
    };
  }

  async findById(entityId: bigint) {
    const logistic = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'title'])
        .include([
          {
            model: ECLogisticUser,
            as: 'logisticUser',
            include: [
              {
                attributes: [
                  'id',
                  'firstname',
                  'lastname',
                  'username',
                  'phoneNumber',
                ],
                model: User,
                as: 'user',
              },
            ],
            where: {
              [Op.and]: [
                {
                  isDefault: true,
                },
                Sequelize.where(
                  Sequelize.fn(
                    'isnull',
                    Sequelize.col('logisticUser.isDeleted'),
                    0,
                  ),
                  {
                    [Op.eq]: 0,
                  },
                ),
              ],
            },
          },
        ])
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('ECLogistic.isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .build(),
    );
    if (!logistic) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }
    return {
      result: logistic,
    };
  }

  async create(user: User, dto: LogisticDto) {
    // check for if title exists before
    const duplicate = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ title: dto.title })
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
    if (duplicate) {
      throw new BadRequestException(
        this.localizationService.translate('core.duplicate_request'),
      );
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let logistic: ECLogistic = null;
    try {
      // mapped logistic item
      const mappedItem = this.mapper.map(dto, LogisticDto, ECLogistic);
      const insertItem = _.omit(mappedItem.toJSON(), ['id']);

      // logistic vendor
      logistic = await this.repository.create(insertItem, {
        transaction: transaction,
      });

      await this.logisticUserRoleHandlerService.addUserToLogistic({
        logisticId: logistic.id,
        user: dto.user,
        isDefault: true,
        transaction: transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return await this.findById(logistic.id);
  }

  async update(entityId: bigint, dto: LogisticDto) {
    // check for item is exists
    const item = await this.repository.findOne(
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
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    // check for if title exists before
    const duplicate = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ title: dto.title })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({
          id: {
            [Op.ne]: entityId,
          },
        })
        .build(),
    );
    if (duplicate) {
      throw new BadRequestException(
        this.localizationService.translate('core.duplicate_request'),
      );
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let logistic: ECLogistic = null;
    try {
      // mapped logistic item
      const mappedItem = this.mapper.map(dto, LogisticDto, ECLogistic);
      // update logistic item
      logistic = (
        await this.repository.update(_.omit(mappedItem.toJSON(), ['id']), {
          where: {
            id: entityId,
          },
          transaction: transaction,
          returning: true,
        })
      )[1][0];

      await this.logisticUserRoleHandlerService.addUserToLogistic({
        logisticId: logistic.id,
        user: dto.user,
        isDefault: true,
        isUpdateLogistic: true,
        transaction: transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return await this.findById(logistic.id);
  }

  async deleteById(entityId: bigint) {
    // find item
    const item = await this.repository.findOne(
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

    // if doesn't found
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    // begin transaction
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      item.isDeleted = true;
      await item.save({ transaction });

      // find default user of this logistic
      const defaultLogisticUser = await this.logisticUserRepository.findOne(
        new QueryOptionsBuilder()
          .include([
            {
              model: User,
              as: 'user',
            },
            {
              model: ECLogistic,
              as: 'logistic',
            },
          ])
          .filter({ logisticId: item.id })
          .filter({ isDefault: true })
          .filter(
            Sequelize.where(
              Sequelize.fn(
                'isnull',
                Sequelize.col('ECLogisticUser.isDeleted'),
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

      await this.logisticUserRoleHandlerService.removeUserFromLogistic({
        user: defaultLogisticUser.user,
        logisticId: item.id,
        transaction: transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return {
      result: _.pick(item, ['id', 'title']),
    };
  }
}
