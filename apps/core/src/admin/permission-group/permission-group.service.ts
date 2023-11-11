import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op, Sequelize } from 'sequelize';
import { PermissionGroup } from '@rahino/database/models/core/permissionGroup.entity';
import { PermissionGroupGetDto } from './dto';

@Injectable()
export class PermissionGroupService {
  constructor(
    @InjectModel(PermissionGroup)
    private readonly repository: typeof PermissionGroup,
  ) {}

  async findAll(filter: PermissionGroupGetDto) {
    let options = QueryFilter.init();

    // search
    const ws = {
      [Op.and]: [
        {
          permissionGroupName: {
            [Op.like]: filter.search,
          },
        },

        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('visibility'), 1),
          {
            [Op.eq]: 1,
          },
        ),
      ],
    };

    options.where = ws;

    const count = await this.repository.count(options);
    options.attributes = [
      'id',
      'permissionGroupName',
      'order',
      'createdAt',
      'updatedAt',
    ];
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);
    options.include = [
      {
        model: Permission,
        as: 'permissions',
        where: Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('visibility'), 1),
          {
            [Op.eq]: 1,
          },
        ),
        attributes: [
          'id',
          'permissionSymbol',
          'permissionName',
          'permissionUrl',
          'permissionMethod',
          'createdAt',
          'updatedAt',
        ],
      },
    ];
    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    const permissionGroup = await this.repository.findOne({
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
        },
      ],
      attributes: [
        'id',
        'permissionGroupName',
        'order',
        'createdAt',
        'updatedAt',
      ],
      where: {
        [Op.and]: [
          {
            id,
          },
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('visibility'), 1),
            {
              [Op.eq]: 1,
            },
          ),
        ],
      },
    });
    if (!permissionGroup) throw new NotFoundException('Not Found!');
    return {
      result: permissionGroup,
    };
  }
}
