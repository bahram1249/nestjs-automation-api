import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op } from 'sequelize';
import { Role } from '@rahino/database';
import { RoleGetDto } from './dto';
import { UserRole } from '@rahino/database';

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
}
