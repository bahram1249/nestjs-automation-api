import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetSuperVisorDto, SuperVisorUserDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { GSSuperVisorUser } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { Role, User, UserRole } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GuaranteeStaticRoleEnum } from '@rahino/guarantee/shared/static-role/enum';

@Injectable()
export class SuperVisorUserService {
  constructor(
    @InjectModel(GSSuperVisorUser)
    private readonly repository: typeof GSSuperVisorUser,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(user: User, filter: GetSuperVisorDto) {
    let query = new QueryOptionsBuilder()
      .include([
        {
          model: User,
          as: 'user',
          required: true,
          attributes: [
            'id',
            'firstname',
            'lastname',
            'phoneNumber',
            'username',
            'nationalCode',
          ],
        },
      ])
      .filter({
        [Op.or]: [
          {
            '$user.firstname$': {
              [Op.like]: filter.search,
            },
          },
          {
            '$user.lastname$': {
              [Op.like]: filter.search,
            },
          },
          {
            '$user.phoneNumber$': {
              [Op.like]: filter.search,
            },
          },
        ],
      });

    const count = await this.repository.count(query.build());

    query = query
      .attributes(['id', 'userId', 'createdAt', 'updatedAt'])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    const results = await this.repository.findAll(query.build());

    return {
      result: results,
      total: count,
    };
  }

  async findById(user: User, entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'userId', 'createdAt', 'updatedAt'])
        .include([
          {
            model: User,
            as: 'user',
            required: true,
            attributes: [
              'id',
              'firstname',
              'lastname',
              'phoneNumber',
              'username',
              'nationalCode',
            ],
          },
        ])
        .filter({ id: entityId })
        .build(),
    );
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    return {
      result: item,
    };
  }

  async create(user: User, dto: SuperVisorUserDto) {
    const duplicate = await this.repository.findOne(
      new QueryOptionsBuilder()
        .include({
          model: User,
          as: 'user',
          required: true,
          where: {
            phoneNumber: dto.phoneNumber,
          },
        })
        .build(),
    );

    if (duplicate) {
      throw new BadRequestException(
        this.localizationService.translate('core.duplicate_request'),
      );
    }

    let result: GSSuperVisorUser;

    const findRole = await this.findRole();
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // create user
      const user = await this.createOrUpdateUser(dto, transaction);

      // add technical person role to user
      await this.insertSuperVisorUserRole(user, findRole, transaction);

      // add technical person
      result = await this.repository.create(
        { userId: user.id },
        { transaction: transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return {
      result: result,
    };
  }

  async updateById(user: User, id: number, dto: SuperVisorUserDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .include([{ model: User, as: 'user' }])
        .filter({ id: id })
        .build(),
    );

    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    if (item.user.phoneNumber != dto.phoneNumber) {
      throw new BadRequestException(
        this.localizationService.translate('core.phoneNumber_must_not_changed'),
      );
    }

    const findRole = await this.findRole();

    try {
      // create user
      const user = await this.createOrUpdateUser(dto, transaction);
      // add technical person role to user
      await this.insertSuperVisorUserRole(user, findRole, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return await this.findById(user, id);
  }

  async deleteById(user: User, entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .include({ model: User, as: 'user' })
        .filter({ id: entityId })
        .build(),
    );
    if (!item) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    const findRole = await this.findRole();

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      await this.removeSuperVisorUserRole(item.user, findRole, transaction);
      await item.destroy({ transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new BadRequestException(error.message);
    }

    return {
      result: _.pick(item, ['id', 'userId', 'createdAt', 'updatedAt']),
    };
  }

  private async createOrUpdateUser(
    dto: SuperVisorUserDto,
    transaction: Transaction,
  ) {
    const user = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ phoneNumber: dto.phoneNumber })
        .transaction(transaction)
        .build(),
    );

    const mappedItem = this.mapper.map(dto, SuperVisorUserDto, User);
    const insertedItem = _.omit(mappedItem.toJSON(), ['id']);
    insertedItem.username = insertedItem.phoneNumber;

    if (!user) {
      const result = await this.userRepository.create(insertedItem, {
        transaction: transaction,
      });
      return result;
    }
    const updated = await this.userRepository.update(insertedItem, {
      where: {
        id: user.id,
      },
      returning: true,
      transaction: transaction,
    });

    return updated[1][0];
  }

  private async insertSuperVisorUserRole(
    user: User,
    role: Role,
    transaction: Transaction,
  ) {
    const userRole = await this.userRoleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ roleId: role.id })
        .transaction(transaction)
        .build(),
    );
    if (!userRole) {
      await this.userRoleRepository.create(
        { userId: user.id, roleId: role.id },
        { transaction: transaction },
      );
    }
  }

  private async removeSuperVisorUserRole(
    user: User,
    role: Role,
    transaction: Transaction,
  ) {
    await this.userRoleRepository.destroy({
      where: {
        userId: user.id,
        roleId: role.id,
      },
      transaction: transaction,
    });
  }

  private async findRole() {
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          static_id: GuaranteeStaticRoleEnum.SupervisorRole,
        })
        .build(),
    );
    return role;
  }
}
