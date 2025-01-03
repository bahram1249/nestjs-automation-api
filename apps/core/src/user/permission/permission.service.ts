import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserRole } from '@rahino/database';
import { User } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Permission } from '@rahino/database';
import { RolePermission } from '@rahino/database';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(Permission)
    private readonly permissionRepository: typeof Permission,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
  ) {}

  async isAccess(user: User, permissionSymbol: string) {
    const permission = await this.permissionRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ permissionSymbol: permissionSymbol })
        .build(),
    );
    if (!permission) {
      throw new NotFoundException(
        "the permission with this symbol isn't found",
      );
    }
    const userRoles = await this.userRoleRepository.findAll(
      new QueryOptionsBuilder()
        .filter({
          userId: user.id,
        })
        .build(),
    );
    const roleIds = userRoles.map((userRole) => userRole.roleId);
    const findPermission = await this.rolePermissionRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          roleId: {
            [Op.in]: roleIds,
          },
        })
        .filter({ permissionId: permission.id })
        .build(),
    );
    let isAccess = false;
    if (findPermission) isAccess = true;
    return {
      result: isAccess,
    };
  }
}
