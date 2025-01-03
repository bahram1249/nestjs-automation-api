import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response } from 'express';
import { Role } from '@rahino/database';
import { PermissionGroup } from '@rahino/database';
import { Op, Sequelize } from 'sequelize';
import { Permission } from '@rahino/database';
import { RolePermission } from '@rahino/database';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly repository: typeof Role,
    @InjectModel(PermissionGroup)
    private readonly permissionGroupRepository: typeof PermissionGroup,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
  ) {}

  async edit(roleId: number) {
    const permissionGroups = await this.permissionGroupRepository.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: [
            'id',
            'permissionSymbol',
            'permissionName',
            'permissionUrl',
            'permissionMethod',
            'createdAt',
            'updatedAt',
          ],
          where: Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('permissions.visibility'), 1),
            {
              [Op.eq]: 1,
            },
          ),
        },
      ],
      where: Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('PermissionGroup.visibility'), 1),
        {
          [Op.eq]: 1,
        },
      ),
    });
    const role = await this.repository.findOne({
      where: {
        id: roleId,
      },
    });
    const currentPermissions = await this.rolePermissionRepository.findAll({
      where: {
        roleId: roleId,
      },
    });
    const permissionIds = currentPermissions.map((item) => item.permissionId);
    if (!role) throw new NotFoundException('Not Founded!');
    return {
      title: 'ویرایش ' + role.roleName,
      layout: false,
      permissionGroups: JSON.parse(JSON.stringify(permissionGroups)),
      role: role.toJSON(),
      permissionIds: JSON.parse(JSON.stringify(permissionIds)),
    };
  }

  async create() {
    const permissionGroups = await this.permissionGroupRepository.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: [
            'id',
            'permissionSymbol',
            'permissionName',
            'permissionUrl',
            'permissionMethod',
            'createdAt',
            'updatedAt',
          ],
          where: Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('permissions.visibility'), 1),
            {
              [Op.eq]: 1,
            },
          ),
        },
      ],
      where: Sequelize.where(
        Sequelize.fn('isnull', Sequelize.col('PermissionGroup.visibility'), 1),
        {
          [Op.eq]: 1,
        },
      ),
    });
    return {
      title: 'ایجاد گروه کاربری',
      layout: false,
      permissionGroups: JSON.parse(JSON.stringify(permissionGroups)),
    };
  }
}
