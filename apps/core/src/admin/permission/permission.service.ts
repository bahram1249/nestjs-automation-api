import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op, Sequelize } from 'sequelize';
import { RolePermission } from '@rahino/database';
import { PermissionGroup } from '@rahino/database';
import { PermissionGetDto } from './dto';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission)
    private readonly permissionRepository: typeof Permission,
    @InjectModel(RolePermission)
    private readonly rolePermissionRepository: typeof RolePermission,
    private readonly seqHelp: SequelizeHelpService,
  ) {}

  async findAll(filter: PermissionGetDto) {
    let options = QueryFilter.init();

    // search
    const ws = {
      [Op.and]: [
        {
          [Op.or]: [
            {
              permissionName: {
                [Op.like]: filter.search,
              },
            },
            {
              permissionUrl: {
                [Op.like]: filter.search,
              },
            },
          ],
        },
        this.seqHelp.whereIsNullColumnEqualToValue(
          'permission.visibility',
          1,
          1,
        ),
      ],
    };

    if (filter.roleId) {
      const permissions = await this.rolePermissionRepository.findAll({
        where: {
          roleId: filter.roleId,
        },
      });
      const permissionIds = permissions.map((permission) => {
        return permission.id;
      });
      ws[Op.and].push(
        Sequelize.where(Sequelize.col('id'), {
          [Op.in]: permissionIds,
        }),
      );
    }

    options.where = ws;

    const count = await this.permissionRepository.count(options);
    options.attributes = [
      'id',
      'permissionName',
      'permissionUrl',
      'permissionSymbol',
      'permissionMethod',
      'permissionGroupId',
      'visibility',
      'createdAt',
      'updatedAt',
    ];
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);
    options.include = [
      {
        model: PermissionGroup,
        as: 'permissionGroup',
        attributes: ['id', 'permissionGroupName'],
      },
    ];
    return {
      result: await this.permissionRepository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    const permission = await this.permissionRepository.findOne({
      include: [
        {
          model: PermissionGroup,
          as: 'permissionGroup',
          attributes: ['id', 'permissionGroupName'],
        },
      ],
      attributes: [
        'id',
        'permissionName',
        'permissionUrl',
        'permissionSymbol',
        'permissionMethod',
        'permissionGroupId',
        'visibility',
        'createdAt',
        'updatedAt',
      ],
      where: {
        id,
      },
    });
    if (!permission) throw new NotFoundException('Not Found!');
    return {
      result: permission,
    };
  }
}
