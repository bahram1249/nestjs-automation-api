import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LogisticDto, GetLogisticDto, LogisticUserDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { ECLogistic, ECLogisticUser } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { Role } from '@rahino/database';
import { UserRoleService } from '@rahino/core/admin/user-role/user-role.service';
import { LocalizationService } from 'apps/main/src/common/localization';
import { ECRoleEnum } from '@rahino/ecommerce/shared/enum';

@Injectable()
export class LogisticService {
  constructor(
    @InjectModel(ECLogistic)
    private readonly repository: typeof ECLogistic,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(ECLogisticUser)
    private readonly logisticUserRepository: typeof ECLogisticUser,

    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
    private readonly userRoleService: UserRoleService,

    private readonly localizationService: LocalizationService,
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

    const logisticRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: ECRoleEnum.Logistic })
        .build(),
    );
    if (!logisticRole) {
      throw new ForbiddenException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    // find user if exists before
    let userLogistic = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ phoneNumber: dto.user.phoneNumber })
        .build(),
    );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let logistic: ECLogistic = null;
    try {
      if (!userLogistic) {
        const mappedUserItem = this.mapper.map(dto.user, LogisticUserDto, User);
        const insertUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
        insertUserItem.username = mappedUserItem.phoneNumber;
        userLogistic = await this.userRepository.create(insertUserItem, {
          transaction: transaction,
        });
      }

      // insert logistic role to user
      await this.userRoleService.insertRoleToUser(
        logisticRole,
        userLogistic,
        transaction,
      );

      // mapped logistic item
      const mappedItem = this.mapper.map(dto, LogisticDto, ECLogistic);
      const insertItem = _.omit(mappedItem.toJSON(), ['id']);

      // logistic vendor
      logistic = await this.repository.create(insertItem, {
        transaction: transaction,
      });

      // insert default vendor user
      const logisticUser = await this.logisticUserRepository.create(
        {
          userId: userLogistic.id,
          logisticId: logistic.id,
          isDefault: true,
        },
        { transaction: transaction },
      );

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

    // find logistic role
    const logisticRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: ECRoleEnum.Logistic })
        .build(),
    );
    if (!logisticRole) {
      throw new ForbiddenException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    // find default user of this logistic
    let defaultLogisticUser = await this.logisticUserRepository.findOne(
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
        .build(),
    );
    if (!defaultLogisticUser) {
      throw new ForbiddenException(
        'default user of this logistic is not founded!',
      );
    }

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let logistic: ECLogistic = null;
    try {
      if (defaultLogisticUser.user.phoneNumber != dto.user.phoneNumber) {
        // remove default user of this vendor
        defaultLogisticUser.isDeleted = true;
        defaultLogisticUser = await defaultLogisticUser.save({
          transaction: transaction,
        });

        // remove logistic role from this old user if is not exists in another logistic
        const existsInAnotherVendor = await this.logisticUserRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ userId: defaultLogisticUser.user.id })
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
        if (!existsInAnotherVendor) {
          // remove logistic role
          await this.userRoleService.removeRoleFromUser(
            logisticRole,
            defaultLogisticUser.user,
            transaction,
          );
        }

        // find user if exists before
        let userLogistic = await this.userRepository.findOne(
          new QueryOptionsBuilder()
            .filter({ phoneNumber: dto.user.phoneNumber })
            .transaction(transaction)
            .build(),
        );
        if (!userLogistic) {
          // insert user if is not exists before
          const mappedUserItem = this.mapper.map(
            dto.user,
            LogisticUserDto,
            User,
          );
          const insertUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
          insertUserItem.username = mappedUserItem.phoneNumber;
          userLogistic = await this.userRepository.create(insertUserItem, {
            transaction: transaction,
          });
        }

        // insert logistic role to user
        await this.userRoleService.insertRoleToUser(
          logisticRole,
          userLogistic,
          transaction,
        );

        // insert user to this logistic as default
        const logisticUser = await this.logisticUserRepository.create(
          {
            userId: userLogistic.id,
            logisticId: item.id,
            isDefault: true,
          },
          {
            transaction: transaction,
          },
        );
      } else {
        const mappedUserItem = this.mapper.map(dto.user, LogisticUserDto, User);
        const updateUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
        updateUserItem.username = mappedUserItem.phoneNumber;
        await this.userRepository.update(updateUserItem, {
          where: { id: defaultLogisticUser.user.id },
          transaction: transaction,
          returning: true,
        });
      }

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

    // find logistic role
    const logisticRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: ECRoleEnum.Logistic })
        .build(),
    );
    if (!logisticRole) {
      throw new ForbiddenException(
        this.localizationService.translate('core.not_found_role'),
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
      let defaultLogisticUser = await this.logisticUserRepository.findOne(
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
          .build(),
      );

      // remove logistic role from this old user if is not exists in another logistic
      const existsInAnotherVendor = await this.logisticUserRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ userId: defaultLogisticUser.user.id })
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
      if (!existsInAnotherVendor) {
        // remove logistic role
        await this.userRoleService.removeRoleFromUser(
          logisticRole,
          defaultLogisticUser.user,
          transaction,
        );
      }
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
