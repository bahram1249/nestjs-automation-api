import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BPMNOrganizationUser } from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { OrganizationUserOutputDto } from './dto';

@Injectable()
export class OrganizationUserService {
  constructor(
    @InjectModel(BPMNOrganizationUser)
    private readonly repository: typeof BPMNOrganizationUser,
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
}
