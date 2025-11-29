import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, User, UserRole } from '@rahino/database';
import { ECLogistic, ECLogisticUser } from '@rahino/localdatabase/models';
import { Mapper } from 'automapper-core';
import { InjectMapper } from 'automapper-nestjs';
import {
  AccessToLogisticDto,
  AddUserToLogisticDto,
  ExistsInAnotherLogisticDto,
  LogisticUserDto,
  RemoveUserFromLogisticDto,
} from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction, where } from 'sequelize';
import { UserRoleService } from '@rahino/core/admin/user-role/user-role.service';
import { ECRoleEnum } from '@rahino/ecommerce/shared/enum';
import { LocalizationService } from 'apps/main/src/common/localization';
import * as _ from 'lodash';

@Injectable()
export class LogisticUserRoleHandlerService {
  constructor(
    @InjectModel(Role) private readonly roleRepository: typeof Role,
    @InjectModel(UserRole) private readonly userRoleRepository: typeof UserRole,
    @InjectModel(ECLogisticUser)
    private readonly logisticUserRepository: typeof ECLogisticUser,
    @InjectModel(User) private readonly userRepository: typeof User,
    @InjectMapper() private readonly mapper: Mapper,
    private readonly userRoleService: UserRoleService,
    private readonly localizationService: LocalizationService,
  ) {}

  async addUserToLogistic(dto: AddUserToLogisticDto) {
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

    // find user if exists before
    let userLogistic = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ phoneNumber: dto.user.phoneNumber })
        .transaction(dto.transaction)
        .build(),
    );

    if (!userLogistic) {
      const mappedUserItem = this.mapper.map(dto.user, LogisticUserDto, User);
      const insertUserItem = _.omit(mappedUserItem.toJSON(), ['id']);
      insertUserItem.username = mappedUserItem.phoneNumber;
      userLogistic = await this.userRepository.create(insertUserItem, {
        transaction: dto.transaction,
      });
    }

    // insert logistic role to user
    await this.userRoleService.insertRoleToUser(
      logisticRole,
      userLogistic,
      dto.transaction,
    );

    const defaultUser = dto.isDefault == true ? true : false;

    if (defaultUser && dto.isUpdateLogistic == true) {
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
          .filter({ logisticId: dto.logisticId })
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
          .transaction(dto.transaction)
          .build(),
      );
      if (!defaultLogisticUser) {
        throw new ForbiddenException(
          'default user of this logistic is not founded!',
        );
      }

      if (defaultLogisticUser.user.phoneNumber != dto.user.phoneNumber) {
        // remove default user of this vendor
        defaultLogisticUser.isDeleted = true;
        defaultLogisticUser = await defaultLogisticUser.save({
          transaction: dto.transaction,
        });

        const existsInOther = await this.existsInAnotherLogistic({
          userId: defaultLogisticUser.userId,
          logisticId: dto.logisticId,
          transaction: dto.transaction,
        });

        if (!existsInOther) {
          await this.userRoleService.removeRoleFromUser(
            logisticRole,
            defaultLogisticUser.user,
            dto.transaction,
          );
        }
      }
    }

    const foundUser = await this.logisticUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ logisticId: dto.logisticId })
        .filter({ userId: userLogistic.id })
        .transaction(dto.transaction)
        .build(),
    );

    if (!foundUser) {
      // insert default vendor user
      const logisticUser = await this.logisticUserRepository.create(
        {
          userId: userLogistic.id,
          logisticId: dto.logisticId,
          isDefault: defaultUser,
        },
        { transaction: dto.transaction },
      );
    }
  }

  async existsInAnotherLogistic(
    dto: ExistsInAnotherLogisticDto,
  ): Promise<boolean> {
    // remove logistic role from this old user if is not exists in another logistic
    const existsInAnotherLogistic = await this.logisticUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: dto.userId })
        .filter({
          logisticId: {
            [Op.not]: dto.logisticId,
          },
        })
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
        .transaction(dto.transaction)
        .build(),
    );
    return existsInAnotherLogistic ? true : false;
  }

  async removeUserFromLogistic(dto: RemoveUserFromLogisticDto) {
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

    // remove logistic role from this old user if is not exists in another logistic
    const existsInAnotherLogistic = await this.existsInAnotherLogistic({
      userId: dto.user.id,
      logisticId: dto.logisticId,
      transaction: dto.transaction,
    });

    await this.logisticUserRepository.update(
      { isDeleted: true },
      {
        where: {
          userId: dto.user.id,
          logisticId: dto.logisticId,
          isDeleted: {
            [Op.is]: null,
          },
        },
        transaction: dto.transaction,
      },
    );

    if (!existsInAnotherLogistic) {
      // remove logistic role
      await this.userRoleService.removeRoleFromUser(
        logisticRole,
        dto.user,
        dto.transaction,
      );
    }
  }

  async checkAccessToLogistic(dto: AccessToLogisticDto) {
    const logisticUser = await this.logisticUserRepository.findOne(
      new QueryOptionsBuilder()
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
        .filter({ userId: dto.user.id })
        .filter({ logisticId: dto.logisticId })
        .transaction(dto.transaction)
        .build(),
    );
    if (!logisticUser)
      throw new ForbiddenException(
        this.localizationService.translate(
          'ecommerce.dont_access_to_this_logistic',
        ),
      );
  }

  // List logistic IDs that the given user has access to (non-deleted mappings)
  async listAccessibleLogisticIds(user: User): Promise<number[]> {
    const rows = await this.logisticUserRepository.findAll(
      new QueryOptionsBuilder()
        .attributes(['logisticId'])
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('ECLogisticUser.isDeleted'),
              0,
            ),
            { [Op.eq]: 0 },
          ),
        )
        .filter({ userId: user.id })
        .build(),
    );
    return (rows || []).map((r: any) => Number(r.logisticId));
  }
}
