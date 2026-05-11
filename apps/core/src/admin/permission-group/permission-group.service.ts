import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Permission } from '@rahino/database';
import { QueryFilter } from '@rahino/query-filter/sequelize-mapper';
import { Op, Sequelize } from 'sequelize';
import { PermissionGroup } from '@rahino/database';
import { PermissionGroupGetDto } from './dto';
import { SequelizeHelpService } from '@rahino/commontools/sequelize-help/sequelize-help.service';

@Injectable()
export class PermissionGroupService {
  constructor(
    @InjectModel(PermissionGroup)
    private readonly repository: typeof PermissionGroup,
    private readonly seqHelp: SequelizeHelpService,
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

        this.seqHelp.whereIsNullColumnEqualToValue(
          'PermissionGroup.visibility',
          1,
          1,
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
    options.include = [
      {
        model: Permission,
        as: 'permissions',
        where: this.seqHelp.whereIsNullColumnEqualToValue(
          'permissions.visibility',
          1,
          1,
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
    if (filter.ignorePaging != true) {
      options = QueryFilter.limitOffset(options, filter);
    }
    options = QueryFilter.order(options, filter);
    return {
      result: await this.repository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    const permissionGroup = await this.repository.findOne({
      attributes: [
        'id',
        'permissionGroupName',
        'order',
        'createdAt',
        'updatedAt',
      ],
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
          where: this.seqHelp.whereIsNullColumnEqualToValue(
            'permissions.visibility',
            1,
            1,
          ),
        },
      ],
      where: {
        [Op.and]: [
          {
            id: id,
          },
          this.seqHelp.whereIsNullColumnEqualToValue(
            'PermissionGroup.visibility',
            1,
            1,
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
