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
  GSSupplierPerson,
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
import { OrganizationUserService } from '@rahino/bpmn/modules/organization-user/organization-user.service';

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

    private readonly organizationUserService: OrganizationUserService,
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
            'nationalCode',
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
              'nationalCode',
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

    const role = await this.findStaticRole(
      GuaranteeStaticRoleEnum.TechnicalPersonRole,
    );

    let result: GSSupplierPerson;

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // create user
      const user = await this.createOrUpdateUser(dto, transaction);

      await this.organizationUserService.addUserOrganizationRole({
        userId: user.id,
        roleId: role.id,
        organizationId: organization.id,
        transaction: transaction,
      });

      // add technical person
      result = await this.repository.create(
        { userId: user.id, organizationId: organization.id },
        { transaction: transaction },
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }

    return {
      result: result,
    };
  }

  async updateById(user: User, id: number, dto: TechnicalPersonDto) {
    const organization =
      await this.organizationStuffService.getOrganizationByUserId(user.id);

    const supplierPerson = await this.repository.findOne(
      new QueryOptionsBuilder()
        .include({ model: User, as: 'user' })
        .filter({ id: id })
        .build(),
    );

    if (supplierPerson.user.phoneNumber != dto.phoneNumber) {
      throw new BadRequestException(
        this.localizationService.translate('core.phoneNumber_must_not_changed'),
      );
    }

    const role = await this.findStaticRole(GuaranteeStaticRoleEnum.Suppliers);

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });

    try {
      // create user
      const user = await this.createOrUpdateUser(dto, transaction);

      await this.organizationUserService.addUserOrganizationRole({
        userId: user.id,
        roleId: role.id,
        organizationId: organization.id,
        transaction: transaction,
      });

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

    const organization =
      await this.organizationStuffService.getOrganizationByUserId(user.id);

    const findRole = await this.findStaticRole(
      GuaranteeStaticRoleEnum.TechnicalPersonRole,
    );

    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    try {
      await item.destroy({ transaction: transaction });

      await this.organizationUserService.removeUserOrganizationRole({
        organizationId: organization.id,
        userId: item.userId,
        roleId: findRole.id,
        transaction: transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
    }

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
        .transaction(transaction)
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

  private async findStaticRole(staticId: number) {
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder().filter({ static_id: staticId }).build(),
    );
    if (!role) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_role'),
      );
    }
    return role;
  }
}
