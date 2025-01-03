import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@rahino/database';
import { User } from '@rahino/database';
import { UserRole } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Transaction } from 'sequelize';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRole) private readonly userRoleRepository: typeof UserRole,
    @InjectModel(Role) private readonly roleRepository: typeof Role,
  ) {}
  async insertRoleToUser(role: Role, user: User, transaction?: Transaction) {
    const findRole = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: role.id })
        .transaction(transaction)
        .build(),
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
        .transaction(transaction)
        .build(),
    );
    if (!findUserRole) {
      const userRole = await this.userRoleRepository.create(
        {
          userId: user.id,
          roleId: role.id,
        },
        {
          transaction: transaction,
        },
      );
    }
  }

  async removeRoleFromUser(role: Role, user: User, transaction?: Transaction) {
    await this.userRoleRepository.destroy({
      where: { userId: user.id, roleId: role.id },
      transaction: transaction,
    });
  }
}
