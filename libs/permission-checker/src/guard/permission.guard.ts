import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { Role } from '@rahino/database/models/core/role.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { PermissionReflector } from '../interface';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Permission)
    private permissionRepository: typeof Permission,
  ) {}

  async canActivate(context: ExecutionContext) {
    const permission = this.reflector.get<PermissionReflector>(
      'permission',
      context.getHandler(),
    );
    if (!permission) {
      return true;
    }
    const request: Express.Request = context.switchToHttp().getRequest();
    const userId: bigint = request.user['id'];
    const access = await this.matchPermission(permission, userId);
    return access;
  }
  private async matchPermission(
    permission: PermissionReflector,
    userId: bigint,
  ) {
    const permissionFinded = await this.permissionRepository.findOne({
      where: {
        permissionSymbol: permission.permissionSymbol,
      },
    });
    if (!permissionFinded) {
      return false;
    }
    const item = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      include: [
        {
          model: UserRole,
          as: 'userRoles',
          required: true,
          include: [
            {
              model: Role,
              as: 'role',
              required: true,
              include: [
                {
                  model: RolePermission,
                  as: 'rolePermissions',
                  required: true,
                  where: {
                    permissionId: permissionFinded.id,
                  },
                },
              ],
            },
          ],
        },
      ],
    });
    let access = true;
    if (!item) access = false;
    return access;
  }
}
