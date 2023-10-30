import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from 'apps/core/src/database/sequelize/models/core/permission.entity';
import { QueryFilter } from 'apps/core/src/util/core/mapper/query-filter.mapper';
import { ListFilter } from 'apps/core/src/util/core/query';
import { Op, Sequelize } from 'sequelize';

@Injectable()
export class PermissionService {
  constructor(
    @InjectModel(Permission)
    private readonly permissionRepository: typeof Permission,
  ) {}

  async findAll(filter: ListFilter) {
    let options = QueryFilter.init();

    // search
    options.where = {
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
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('visibility'), 1),
          {
            [Op.eq]: 1,
          },
        ),
      ],
    };

    const count = await this.permissionRepository.count(options);
    options.attributes = [
      'id',
      'permissionName',
      'permissionUrl',
      'permissionMethod',
      'permissionGroupId',
      'visibility',
      'createdAt',
      'updatedAt',
    ];
    options = QueryFilter.toFindAndCountOptions(options, filter);
    return {
      result: await this.permissionRepository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    const permission = await this.permissionRepository.findOne({
      attributes: [
        'id',
        'permissionName',
        'permissionUrl',
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
