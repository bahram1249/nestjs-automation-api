import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import {
  BPMNOrganization,
  BPMNOrganizationUser,
  GSAddress,
  GSCity,
  GSGuaranteeOrganization,
  GSNeighborhood,
  GSProvince,
} from '@rahino/localdatabase/models';
import {
  GetGuaranteeOrganizationDto,
  GuaranteeOrganizationDto,
  UserDto,
} from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize, Transaction } from 'sequelize';
import { Role, User, UserRole } from '@rahino/database';
import { LocalizationService } from 'apps/main/src/common/localization';
import { OrganizationService } from '@rahino/bpmn/modules/organization';
import { InjectMapper } from 'automapper-nestjs';
import { Mapper } from 'automapper-core';
import { OrganizationDto } from '@rahino/bpmn/modules/organization/dto';
import * as _ from 'lodash';
import { GuaranteeStaticRoleEnum } from '@rahino/guarantee/shared/static-role/enum';
import { AddressService } from '@rahino/guarantee/client/address/address.service';

@Injectable()
export class GuaranteeOrganizationService {
  constructor(
    @InjectModel(GSGuaranteeOrganization)
    private readonly repository: typeof GSGuaranteeOrganization,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(BPMNOrganizationUser)
    private readonly organizationUserRepository: typeof BPMNOrganizationUser,
    private readonly localizationService: LocalizationService,
    private readonly organizationService: OrganizationService,
    private readonly addressService: AddressService,
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(filter: GetGuaranteeOrganizationDto) {
    let query = new QueryOptionsBuilder()
      .include([
        {
          model: BPMNOrganization,
          as: 'organization',
          attributes: ['id', 'name'],
          required: true,
          where: {
            name: {
              [Op.like]: filter.search,
            },
          },
        },
      ])
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSGuaranteeOrganization.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );

    // count
    const count = await this.repository.count(query.build());

    // extends query
    query = query
      .attributes([
        'id',
        'addressId',
        'userId',
        'isNationwide',
        'isOnlinePayment',
        'createdAt',
        'updatedAt',
      ])
      .thenInclude({
        model: GSAddress,
        as: 'address',
        required: false,
        attributes: [
          'id',
          'name',
          'latitude',
          'longitude',
          'provinceId',
          'cityId',
          'neighborhoodId',
          'street',
          'alley',
          'plaque',
          'floorNumber',
          'postalCode',
        ],
        include: [
          {
            model: GSProvince,
            as: 'province',
            attributes: ['id', 'name', 'slug'],
            required: false,
          },
          {
            model: GSCity,
            as: 'city',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: GSNeighborhood,
            as: 'neighborhood',
            required: false,
          },
        ],
      })
      .thenInclude({
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
        required: false,
      })

      .order({ sortOrder: filter.sortOrder, orderBy: filter.orderBy })
      .offset(filter.offset)
      .limit(filter.limit);

    return {
      result: await this.repository.findAll(query.build()),
      total: count,
    };
  }

  async findById(entityId: number) {
    let query = new QueryOptionsBuilder()
      .attributes([
        'id',
        'addressId',
        'userId',
        'isNationwide',
        'isOnlinePayment',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: BPMNOrganization,
          as: 'organization',
          attributes: ['id', 'name'],
          required: true,
        },
      ])
      .thenInclude({
        model: GSAddress,
        as: 'address',
        required: false,
        attributes: [
          'id',
          'name',
          'latitude',
          'longitude',
          'provinceId',
          'cityId',
          'neighborhoodId',
          'street',
          'alley',
          'plaque',
          'floorNumber',
          'postalCode',
        ],
        include: [
          {
            model: GSProvince,
            as: 'province',
            attributes: ['id', 'name', 'slug'],
            required: false,
          },
          {
            model: GSCity,
            as: 'city',
            attributes: ['id', 'name'],
            required: false,
          },
          {
            model: GSNeighborhood,
            as: 'neighborhood',
            required: false,
          },
        ],
      })
      .thenInclude({
        model: User,
        as: 'user',
        attributes: ['id', 'firstname', 'lastname', 'phoneNumber'],
        required: false,
      })
      .filter(
        Sequelize.where(
          Sequelize.fn(
            'isnull',
            Sequelize.col('GSGuaranteeOrganization.isDeleted'),
            0,
          ),
          {
            [Op.eq]: 0,
          },
        ),
      );

    const item = await this.repository.findOne(query.build());
    if (!item) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found'),
      );
    }
    return {
      result: item,
    };
  }

  async create(dto: GuaranteeOrganizationDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let guaranteeOrganization: GSGuaranteeOrganization;
    try {
      const organizationMapped = this.mapper.map(
        dto,
        GuaranteeOrganizationDto,
        OrganizationDto,
      );

      console.log(dto);
      // create or update user
      const user = await this.createOrUpdateUser(dto.user, transaction);
      // assign organization role  to user
      await this.assignedOrganizationRole(user, transaction);

      // create organization on base table
      const organization = await this.organizationService.create(
        organizationMapped,
        transaction,
      );

      // create address
      const address = await this.addressService.create(
        user,
        dto.address,
        transaction,
      );

      // create guarantee organization
      guaranteeOrganization = await this.repository.create(
        {
          id: organization.id,
          isNationWide: dto.isNationwide,
          isOnlinePayment: dto.isOnlinePayment,
          userId: user.id,
          addressId: address.result.id,
        },
        { transaction: transaction },
      );

      // assign user to organization
      await this.assignedOrganizationUser(
        user,
        guaranteeOrganization,
        transaction,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }

    return await this.findById(guaranteeOrganization.id);
  }

  async updateById(id: number, dto: GuaranteeOrganizationDto) {
    const transaction = await this.sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
    });
    let guaranteeOrganization = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSGuaranteeOrganization.isDeleted'),
              0,
            ),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter({ id: id })
        .build(),
    );
    if (!guaranteeOrganization) {
      throw new NotFoundException(
        this.localizationService.translate('core.not_found'),
      );
    }
    try {
      const organizationMapped = this.mapper.map(
        dto,
        GuaranteeOrganizationDto,
        OrganizationDto,
      );

      // update organization

      await this.organizationService.update(
        guaranteeOrganization.id,
        organizationMapped,
        transaction,
      );

      // create or update user
      const user = await this.createOrUpdateUser(dto.user, transaction);
      // assign organization role  to user
      await this.assignedOrganizationRole(user, transaction);

      // create guarantee organization
      await this.repository.update(
        {
          isNationWide: dto.isNationwide,
          isOnlinePayment: dto.isOnlinePayment,
          userId: user.id,
        },
        {
          where: {
            id: id,
          },
        },
      );

      // assign user to organization
      await this.assignedOrganizationUser(
        user,
        guaranteeOrganization,
        transaction,
      );

      // update address
      await this.addressService.update(
        user,
        guaranteeOrganization.addressId,
        dto.address,
        transaction,
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new InternalServerErrorException(error.message);
    }

    return await this.findById(guaranteeOrganization.id);
  }

  async deleteById(entityId: number) {
    const item = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: entityId })
        .filter(
          Sequelize.where(
            Sequelize.fn(
              'isnull',
              Sequelize.col('GSGuaranteeOrganization.isDeleted'),
              0,
            ),
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
    item.isDeleted = true;
    await item.save();
    return {
      result: _.pick(item, [
        'id',
        'addressId',
        'userId',
        'isNationwide',
        'isOnlinePayment',
      ]),
    };
  }

  private async createOrUpdateUser(
    dto: UserDto,
    transaction?: Transaction,
  ): Promise<User> {
    let user = await this.userRepository.findOne(
      new QueryOptionsBuilder()
        .attributes(['id', 'firstname', 'lastname', 'username', 'phoneNumber'])
        .filter({ phoneNumber: dto.phoneNumber })
        .build(),
    );
    if (!user) {
      const mappedItem = _.pick(dto, ['firstname', 'lastname', 'phoneNumber']);
      let insertItem = mappedItem as any;
      insertItem.username = dto.phoneNumber;
      user = await this.userRepository.create(insertItem, {
        transaction: transaction,
      });
    } else {
      user.firstname = dto.firstname;
      user.lastname = dto.lastname;
      user.phoneNumber = dto.phoneNumber;
      user.username = dto.phoneNumber;
      await user.save();
    }
    return user;
  }

  private async assignedOrganizationRole(
    user: User,
    transaction?: Transaction,
  ) {
    const organizationRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: GuaranteeStaticRoleEnum.OrganizationRole })
        .build(),
    );
    if (!organizationRole) {
      throw new InternalServerErrorException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    const isExistBefore = await this.userRoleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id, roleId: organizationRole.id })
        .build(),
    );
    if (!isExistBefore) {
      await this.userRoleRepository.create(
        {
          userId: user.id,
          roleId: organizationRole.id,
        },
        {
          transaction: transaction,
        },
      );
    }
  }

  private async assignedOrganizationUser(
    user: User,
    guaranteeOrganization?: GSGuaranteeOrganization,
    transaction?: Transaction,
  ) {
    const isExistsBefore = await this.organizationUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ organizationId: guaranteeOrganization.id })
        .transaction(transaction)
        .build(),
    );
    if (!isExistsBefore) {
      await this.organizationUserRepository.create(
        {
          userId: user.id,
          organizationId: guaranteeOrganization.id,
        },
        { transaction: transaction },
      );
    }
  }
}
