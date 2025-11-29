import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNOrganizationUser } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import {
  AddUserOrganizationRoleDto,
  OrganizationUserOutputDto,
  RemoveUserOrganizationRoleDto,
} from './dto';
import { Role, UserRole } from '@rahino/database';
import { GuaranteeStaticRoleEnum } from '@rahino/guarantee/shared/static-role/enum';
import { Op } from 'sequelize';

@Injectable()
export class OrganizationUserService {
  constructor(
    @InjectModel(BPMNOrganizationUser)
    private readonly repository: typeof BPMNOrganizationUser,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
  ) {}

  async findAllOrganizationIds(userId: bigint): Promise<number[]> {
    const organizations = await this.repository.findAll(
      new QueryOptionsBuilder().filter({ userId: userId }).build(),
    );
    return organizations.map((organization) => organization.organizationId);
  }

  async findAllOrganizationRole(
    userId: bigint,
  ): Promise<OrganizationUserOutputDto[]> {
    const organizationUsers = await this.repository.findAll(
      new QueryOptionsBuilder().filter({ userId: userId }).build(),
    );
    return organizationUsers.map(
      (organizationUser): OrganizationUserOutputDto => ({
        organizationId: organizationUser.organizationId,
        roleId: organizationUser.roleId,
      }),
    );
  }

  async findAllOrganizationWithOrganizationRole(userId: bigint) {
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: GuaranteeStaticRoleEnum.OrganizationRole })
        .build(),
    );
    const organizationUsers = await this.repository.findAll(
      new QueryOptionsBuilder()
        .filter({ userId: userId })
        .filter({ roleId: role.id })
        .build(),
    );
    return organizationUsers.map(
      (organizationUser) => organizationUser.organizationId,
    );
  }

  async addUserOrganizationRole(
    addUserOrganizationRole: AddUserOrganizationRoleDto,
  ) {
    const duplicate = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: addUserOrganizationRole.userId })
        .filter({ organizationId: addUserOrganizationRole.organizationId })
        .filter({ roleId: addUserOrganizationRole.roleId })
        .transaction(addUserOrganizationRole.transaction)
        .build(),
    );
    if (duplicate) return;

    await this.repository.create(
      {
        organizationId: addUserOrganizationRole.organizationId,
        userId: addUserOrganizationRole.userId,
        roleId: addUserOrganizationRole.roleId,
      },
      {
        transaction: addUserOrganizationRole.transaction,
      },
    );

    const userRole = await this.userRoleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          userId: addUserOrganizationRole.userId,
        })
        .filter({ roleId: addUserOrganizationRole.roleId })
        .transaction(addUserOrganizationRole.transaction)
        .build(),
    );

    if (!userRole) {
      await this.userRoleRepository.create(
        {
          userId: addUserOrganizationRole.userId,
          roleId: addUserOrganizationRole.roleId,
        },
        {
          transaction: addUserOrganizationRole.transaction,
        },
      );
    }
  }

  async removeUserOrganizationRole(
    removeUserOrganizationRole: RemoveUserOrganizationRoleDto,
  ) {
    const find = await this.repository.findOne(
      new QueryOptionsBuilder()
        .filter({
          userId: removeUserOrganizationRole.userId,
        })
        .filter({ roleId: removeUserOrganizationRole.roleId })
        .filter({ organizationId: removeUserOrganizationRole.organizationId })
        .transaction(removeUserOrganizationRole.transaction)
        .build(),
    );

    if (find) {
      const findInAnotherOrganizatin = await this.repository.findOne(
        new QueryOptionsBuilder()
          .filter({
            userId: removeUserOrganizationRole.userId,
          })
          .filter({ roleId: removeUserOrganizationRole.roleId })
          .filter({
            organizationId: {
              [Op.ne]: removeUserOrganizationRole.organizationId,
            },
          })
          .transaction(removeUserOrganizationRole.transaction)
          .build(),
      );

      if (!findInAnotherOrganizatin) {
        await this.userRoleRepository.destroy({
          where: {
            userId: removeUserOrganizationRole.userId,
            roleId: removeUserOrganizationRole.roleId,
          },
          transaction: removeUserOrganizationRole.transaction,
        });
      }

      await find.destroy({
        transaction: removeUserOrganizationRole.transaction,
      });
    }
  }
}
