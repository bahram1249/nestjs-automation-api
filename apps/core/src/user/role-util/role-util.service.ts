import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@rahino/database/models/core/role.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class RoleUtilService {
  private superAdminStaticId = 1;
  constructor(
    @InjectModel(UserRole) private readonly userRoleRepository: typeof UserRole,
    @InjectModel(Role) private readonly roleRepository: typeof Role,
  ) {}

  async isSuperAdmin(user: User) {
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ static_id: this.superAdminStaticId })
        .build(),
    );
    if (!role) {
      throw new InternalServerErrorException('super admin role is not defined');
    }
    const userRole = await this.userRoleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ roleId: role.id })
        .build(),
    );
    if (!userRole) {
      return false;
    }
    return true;
  }
}
