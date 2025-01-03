import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';
import { Menu } from '@rahino/database';
import { MenuGetDto } from './dto';
import { User } from '@rahino/database';
import { UserRole } from '@rahino/database';
import { RolePermission } from '@rahino/database';
import { PermissionMenu } from '@rahino/database';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

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

    let builder = new QueryOptionsBuilder();
    if (filter.onlyParent) {
      builder = builder.filter({
        parentMenuId: {
          [Op.is]: null,
        },
      });
    }

    builder = builder.filter(
      Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('Menu.visibility'), 1),
        {
          [Op.eq]: 1,
        },
      ),
    );

    builder = builder
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter({
        id: {
          [Op.in]: menuIds,
        },
      });

    const count = await this.repository.count(builder.build());

    builder = builder
      .include([
        {
          model: Menu,
          as: 'subMenus',
          required: false,
          where: {
            [Op.and]: [
              {
                id: {
                  [Op.in]: menuIds,
                },
              },
              Sequelize.where(
                Sequelize.fn('isnull', Sequelize.col('subMenus.visibility'), 1),
                {
                  [Op.eq]: 1,
                },
              ),
            ],
          },
        },
      ])
      .limit(filter.limit, filter.ignorePaging)
      .offset(filter.offset, filter.ignorePaging)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder });

    return {
      result: await this.repository.findAll(builder.build()),
      total: count,
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
