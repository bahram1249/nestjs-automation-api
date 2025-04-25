import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNOrganizationUser } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { OrganizationUserOutputDto } from './dto';
import { Role } from '@rahino/database';
import { GuaranteeStaticRoleEnum } from '@rahino/guarantee/shared/static-role/enum';

@Injectable()
export class OrganizationUserService {
  constructor(
    @InjectModel(BPMNOrganizationUser)
    private readonly repository: typeof BPMNOrganizationUser,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
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
}
