import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@rahino/database/models/core/role.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRole) private readonly userRoleRepository: typeof UserRole,
    @InjectModel(Role) private readonly roleRepository: typeof Role,
  ) {}
  async insertRoleToUser(role: Role, user: User) {
    const findRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder().filter({ id: role.id }).build(),
    );
    if (!findRole) {
      throw new BadRequestException(
        'the role with this given id is not exists',
      );
    }
    const findUserRole = await this.userRoleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: user.id })
        .filter({ roleId: role.id })
        .build(),
    );
    if (!findUserRole) {
      const userRole = await this.userRoleRepository.create({
        userId: user.id,
        roleId: role.id,
      });
    }
  }

  async removeRoleFromUser(role: Role, user: User) {
    await this.userRoleRepository.destroy({
      where: { userId: user.id, roleId: role.id },
    });
  }
}
