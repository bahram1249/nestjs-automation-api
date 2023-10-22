import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'apps/core/src/database/sequelize/models/core/role.entity';
import { QueryFilter } from 'apps/core/src/util/core/mapper/query-filter.mapper';
import { ListFilter } from 'apps/core/src/util/core/query';
import { Op } from 'sequelize';
import { RoleDto } from './dto';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
import { RolePermission } from 'apps/core/src/database/sequelize/models/core/rolePermission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    @InjectModel(Permission)
    private readonly permissionRepository: typeof Permission,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
  ) {}

  async findAll(filter: ListFilter) {
    let options = QueryFilter.init();

    // include
    options.include = [
      {
        model: Permission,
      },
    ];

    // search
    options.where = {
      roleName: {
        [Op.like]: filter.search,
      },
    };

    const count = await this.roleRepository.count(options);
    options.attributes = [
      'id',
      'roleName',
      'static_id',
      'createdAt',
      'updatedAt',
    ];
    options = QueryFilter.toFindAndCountOptions(options, filter);
    return {
      result: await this.roleRepository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    return await this.roleRepository.findOne({
      include: [
        {
          model: Permission,
        },
      ],
      attributes: ['id', 'roleName', 'static_id', 'createdAt', 'updatedAt'],
      where: {
        id,
      },
    });
  }

  async create(dto: RoleDto) {
    let role = await this.roleRepository.findOne({
      where: {
        roleName: dto.roleName,
      },
    });
    if (role) throw new ForbiddenException('Credentials taken');

    if (
      dto.permissions &&
      (dto.ignorePermission == null || dto.ignorePermission == false)
    ) {
      for (let index = 0; index < dto.permissions.length; index++) {
        const permissionId = dto.permissions[index];
        let permission = await this.permissionRepository.findOne({
          where: {
            id: permissionId,
          },
        });
        if (!permission)
          throw new BadRequestException(
            `the permission id: ${permissionId} is not found!`,
          );
      }
    }

    const roleObj = JSON.parse(JSON.stringify(dto));
    role = await this.roleRepository.create(roleObj);

    if (
      dto.permissions &&
      (dto.ignorePermission == null || dto.ignorePermission == false)
    ) {
      for (let index = 0; index < dto.permissions.length; index++) {
        const permissionId = dto.permissions[index];
        const userRole = await this.rolePermissionRepository.create({
          roleId: role.id,
          permissionId: permissionId,
        });
      }
    }

    role = await this.roleRepository.findOne({
      include: [
        {
          model: Permission,
        },
      ],
      attributes: ['id', 'roleName', 'static_id', 'createdAt', 'updatedAt'],
      where: {
        id: role.id,
      },
    });
    return {
      result: role,
    };
  }

  async update(roleId: number, dto: RoleDto) {
    // logic validation
    let role = await this.roleRepository.findOne({
      where: {
        id: roleId,
      },
    });
    if (!role) throw new NotFoundException('Not Found!');

    if (
      dto.permissions &&
      (dto.ignorePermission == null || dto.ignorePermission == false)
    ) {
      for (let index = 0; index < dto.permissions.length; index++) {
        const permissionId = dto.permissions[index];
        let permission = await this.permissionRepository.findOne({
          where: {
            id: permissionId,
          },
        });
        if (!permission)
          throw new BadRequestException(
            `the permission id: ${permissionId} is not found!`,
          );
      }
    }

    await this.roleRepository.update(JSON.parse(JSON.stringify(dto)), {
      where: {
        id: roleId,
      },
    });

    if (dto.ignorePermission == null || dto.ignorePermission == false) {
      // remove all roles of this user
      await this.rolePermissionRepository.destroy({
        where: {
          roleId: roleId,
        },
      });

      if (dto.permissions) {
        for (let index = 0; index < dto.permissions.length; index++) {
          const permissionId = dto.permissions[index];
          const rolePermission = await this.rolePermissionRepository.create({
            roleId: roleId,
            permissionId: permissionId,
          });
        }
      }
    }

    role = await this.roleRepository.findOne({
      include: [
        {
          model: Permission,
        },
      ],
      attributes: ['id', 'roleName', 'static_id', 'createdAt', 'updatedAt'],
      where: {
        id: roleId,
      },
    });
    return {
      result: role,
    };
  }
}
