import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryFilter } from 'apps/core/src/util/core/mapper/query-filter.mapper';
import { Op } from 'sequelize';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { MenuGetDto } from './dto';
import { User } from '@rahino/database/models/core/user.entity';
import { UserRole } from '@rahino/database/models/core/userRole.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { PermissionMenu } from '@rahino/database/models/core/permission-menu.entity';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private readonly repository: typeof Menu,
    @InjectModel(UserRole)
    private readonly userRoleRepository: typeof UserRole,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
    @InjectModel(PermissionMenu)
    private readonly permissionMenuRepository: typeof PermissionMenu,
  ) {}

  async findAll(user: User, filter: MenuGetDto) {
    const userRoles = await this.userRoleRepository.findAll({
      where: {
        userId: user.id,
      },
    });
    const roleIds = userRoles.map((userRole) => userRole.roleId);
    const rolePermissions = await this.rolePermissionRepository.findAll({
      where: {
        roleId: {
          [Op.in]: roleIds,
        },
      },
    });
    const permissionIds = rolePermissions.map(
      (rolePermission) => rolePermission.permissionId,
    );
    const permissionMenus = await this.permissionMenuRepository.findAll({
      where: {
        permissionId: {
          [Op.in]: permissionIds,
        },
      },
    });
    const menuIds = permissionMenus.map((permissionMenu) => {
      return permissionMenu.menuId;
    });
    let options = QueryFilter.init();
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);
    options.where = {
      [Op.and]: [
        {
          title: {
            [Op.like]: filter.search,
          },
        },
        {
          id: {
            [Op.in]: menuIds,
          },
        },
      ],
    };
    return {
      result: await this.repository.findAll(options),
      total: await this.repository.count(options),
    };
  }

  async findById(user: User, id: number) {
    const userRoles = await this.userRoleRepository.findAll({
      where: {
        userId: user.id,
      },
    });
    const roleIds = userRoles.map((userRole) => userRole.roleId);
    const rolePermissions = await this.rolePermissionRepository.findAll({
      where: {
        roleId: {
          [Op.in]: roleIds,
        },
      },
    });
    const permissionIds = rolePermissions.map(
      (rolePermission) => rolePermission.permissionId,
    );
    const permissionMenus = await this.permissionMenuRepository.findAll({
      where: {
        permissionId: {
          [Op.in]: permissionIds,
        },
      },
    });
    const menuIds = permissionMenus.map((permissionMenu) => {
      return permissionMenu.menuId;
    });

    const menu = await this.repository.findOne({
      where: {
        [Op.and]: [
          {
            id: id,
          },
          {
            id: {
              [Op.in]: menuIds,
            },
          },
        ],
      },
    });
    if (!menu) throw new NotFoundException();
    return {
      result: menu,
    };
  }
}
