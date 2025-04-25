import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op } from 'sequelize';
import { Role } from '@rahino/database';
import { RoleGetDto } from './dto';
import { UserRole } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly repository: typeof Role,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
  ) {}

  async findAll(userId: bigint, filter: RoleGetDto) {
    let options = QueryFilter.init();
    const userRoles = await this.userRoleRepository.findAll({
      where: {
        userId: userId,
      },
    });
    const roleIds = userRoles.map((userRole) => userRole.roleId);
    // search
    options.where = {
      id: {
        [Op.in]: roleIds,
      },
    };

    const count = await this.repository.count(options);
    options.attributes = ['id', 'roleName', 'createdAt', 'updatedAt'];
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);
    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findAllRoleId(userId: bigint): Promise<number[]> {
    const roles = await this.userRoleRepository.findAll(
      new QueryOptionsBuilder()
        .attributes(['id', 'roleId'])
        .filter({ userId: userId })
        .build(),
    );
    return roles.map((item) => item.roleId);
  }

  async isAccessToStaticRole(
    userId: bigint,
    staticId: number,
  ): Promise<boolean> {
    const staticRole = await this.repository.findOne(
      new QueryOptionsBuilder().filter({ static_id: staticId }).build(),
    );
    if (!staticRole) return false;
    const userRole = await this.userRoleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: userId })
        .filter({ roleId: staticRole.id })
        .build(),
    );
    if (!userRole) return false;
    return true;
  }
}
