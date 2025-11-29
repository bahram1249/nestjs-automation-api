import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { Role } from '@rahino/database';
import { UserRole } from '@rahino/database';
import { User } from '@rahino/database';
import { PermissionReflector } from '../interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User)
    private userRepository: typeof User,
    @InjectModel(Permission)
    private permissionRepository: typeof Permission,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
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
    let access = true;
    const defined = await this.cacheManager.get(
      `userid:${userId}->permission:${permission.permissionSymbol}`,
    );
    if (defined == false) {
      access = false;
    } else if (defined == true) {
      access = true;
    } else {
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

      if (!item) access = false;
      await this.cacheManager.set(
        `userid:${userId}->permission:${permission.permissionSymbol}`,
        access,
      );
    }
    return access;
  }
}
