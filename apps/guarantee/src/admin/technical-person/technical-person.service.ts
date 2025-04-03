import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GetTechnicalPersonDto, TechnicalPersonDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganizationUser,
  GSTechnicalPerson,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import * as _ from 'lodash';
import { OrganizationStuffService } from '@rahino/guarantee/shared/organization-stuff';
import { Role, User, UserRole } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { GuaranteeStaticRoleEnum } from '@rahino/guarantee/shared/static-role/enum';

@Injectable()
export class TechnicalPersonService {
  constructor(
    @InjectModel(GSTechnicalPerson)
    private readonly repository: typeof GSTechnicalPerson,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(BPMNOrganizationUser)
    private readonly bpmnOrganizationUserRepository: typeof BPMNOrganizationUser,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly organizationStuffService: OrganizationStuffService,
    private readonly localizationService: LocalizationService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(user: User, filter: GetTechnicalPersonDto) {
    const organization =
      await this.organizationStuffService.getOrganizationByUserId(user.id);

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
          ],
        },
      ])
      .filter({
        organizationId: organization.id,
      })
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
      .attributes(['id', 'userId', 'organizationId', 'createdAt', 'updatedAt'])
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
    const organization =
      await this.organizationStuffService.getOrganizationByUserId(user.id);

    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .attributes([
          'id',
          'organizationId',
          'userId',
          'createdAt',
          'updatedAt',
        ])
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
            ],
          },
        ])
        .filter({
          organizationId: organization.id,
        })
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

  async create(user: User, dto: TechnicalPersonDto) {
    const organization =
      await this.organizationStuffService.getOrganizationByUserId(user.id);

    let result: GSTechnicalPerson;

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // create user
      const user = await this.createOrUpdateUser(dto, transaction);

      // add technical person role to user
      await this.insertTechnicalPersonRole(user, transaction);

      // add to bpmn organization user
      await this.addToBpmnOrganizationUser(user, organization.id, transaction);

      // add technical person
      result = await this.repository.create(
        { userId: user.id, organizationId: organization.id },
        { transaction: transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error);
    }

    return {
      result: result,
    };
  }

  async updateById(user: User, id: number, dto: TechnicalPersonDto) {
    const organization =
      await this.organizationStuffService.getOrganizationByUserId(user.id);

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // create user
      const user = await this.createOrUpdateUser(dto, transaction);

      // add technical person role to user
      await this.insertTechnicalPersonRole(user, transaction);

      // add to bpmn organization user
      await this.addToBpmnOrganizationUser(user, organization.id, transaction);

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error);
    }

    return await this.findById(user, id);
  }

  async deleteById(user: User, entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ id: entityId }).build(),
    );
    if (!item) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_id'),
      );
    }

    await item.destroy();
    return {
      result: _.pick(item, [
        'id',
        'userId',
        'organizationId',
        'createdAt',
        'updatedAt',
      ]),
    };
  }

  private async createOrUpdateUser(
    dto: TechnicalPersonDto,
    transaction: Transaction,
  ) {
    const user = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ phoneNumber: dto.phoneNumber })
        .build(),
    );

    const mappedItem = this.mapper.map(dto, TechnicalPersonDto, User);
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

  private async insertTechnicalPersonRole(
    user: User,
    transaction: Transaction,
  ) {
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          static_id: GuaranteeStaticRoleEnum.TechnicalPersonRole,
        })
        .build(),
    );
    if (!role) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_role'),
      );
    }
    const userRole = await this.userRepository.findOne(
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

  private async addToBpmnOrganizationUser(
    user: User,
    organizationId: number,
    transaction: Transaction,
  ) {
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          static_id: GuaranteeStaticRoleEnum.TechnicalPersonRole,
        })
        .build(),
    );
    if (!role) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    const technicalBpmnOrganizationUser =
      await this.bpmnOrganizationUserRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ userId: user.id })
          .filter({ organizationId: organizationId })
          .filter({ roleId: role.id })
          .transaction(transaction)
          .build(),
      );

    if (!technicalBpmnOrganizationUser) {
      await this.bpmnOrganizationUserRepository.create(
        {
          userId: user.id,
          organizationId: organizationId,
          roleId: role.id,
        },
        { transaction: transaction },
      );
    }
  }
}
