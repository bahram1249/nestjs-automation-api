import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Menu } from 'apps/core/src/database/sequelize/models/core/menu.entity';
import { QueryFilter } from 'apps/core/src/util/core/mapper/query-filter.mapper';
import { ListFilter } from 'apps/core/src/util/core/query';
import { Op } from 'sequelize';
import { MenuDto } from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private readonly menuRepository: typeof Menu,
  ) {}

  async findAll(filter: ListFilter) {
    let options = QueryFilter.init();

    // search
    options.where = {
      menuName: {
        [Op.like]: filter.search,
      },
    };

    const count = await this.menuRepository.count(options);
    options.attributes = [
      'id',
      'title',
      'url',
      'icon',
      'className',
      'subMenuId',
      'order',
      'createdAt',
      'updatedAt',
    ];
    options = QueryFilter.toFindAndCountOptions(options, filter);
    return {
      result: await this.menuRepository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    return {
      result: await this.menuRepository.findOne({
        attributes: [
          'id',
          'title',
          'url',
          'icon',
          'className',
          'subMenuId',
          'order',
          'createdAt',
          'updatedAt',
        ],
        where: {
          id,
        },
      }),
    };
  }

  async create(dto: MenuDto) {
    const menuObj = JSON.parse(JSON.stringify(dto));
    let menu = await this.menuRepository.create(menuObj);

    menu = await this.menuRepository.findOne({
      attributes: [
        'id',
        'title',
        'url',
        'icon',
        'className',
        'subMenuId',
        'order',
        'createdAt',
        'updatedAt',
      ],
      where: {
        id: menu.id,
      },
    });
    return {
      result: menu,
    };
  }

  async update(menuId: number, dto: MenuDto) {
    // logic validation
    let menu = await this.menuRepository.findOne({
      where: {
        id: menuId,
      },
    });
    if (!menu) throw new NotFoundException('Not Found!');

    await this.menuRepository.update(JSON.parse(JSON.stringify(dto)), {
      where: {
        id: menuId,
      },
    });

    menu = await this.menuRepository.findOne({
      attributes: [
        'id',
        'title',
        'url',
        'icon',
        'className',
        'subMenuId',
        'order',
        'createdAt',
        'updatedAt',
      ],
      where: {
        id: menuId,
      },
    });
    return {
      result: menu,
    };
  }
}
