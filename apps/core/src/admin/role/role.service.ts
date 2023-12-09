import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@rahino/database/models/core/role.entity';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op } from 'sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { RolePermission } from '@rahino/database/models/core/rolePermission.entity';
import { RoleGetDto, RoleDto } from './dto';

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

  async findAll(filter: RoleGetDto) {
    let options = QueryFilter.init();
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

    // include
    options.include = [
      {
        model: Permission,
      },
    ];
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }

    options = QueryFilter.order(options, filter);
    return {
      result: await this.roleRepository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    return {
      result: await this.roleRepository.findOne({
        include: [
          {
            model: Permission,
          },
        ],
        attributes: ['id', 'roleName', 'static_id', 'createdAt', 'updatedAt'],
        where: {
          id,
        },
      }),
    };
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
