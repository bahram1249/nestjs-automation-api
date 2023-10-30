import { Injectable, NotFoundException } from '@nestjs/common';

import { InjectModel } from '@nestjs/sequelize';
import { Menu } from 'apps/core/src/database/sequelize/models/core/menu.entity';
import { QueryFilter } from 'apps/core/src/util/core/mapper/query-filter.mapper';
import { Op, Sequelize } from 'sequelize';
import { GetMenuDto, MenuDto } from './dto';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private readonly menuRepository: typeof Menu,
  ) {}

  async findAll(filter: GetMenuDto) {
    let options = QueryFilter.init();

    // search
    options.where = {
      [Op.and]: [
        {
          title: {
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
    if (filter.onlyParent == true) {
      options.where[Op.and].push({
        parentMenuId: {
          [Op.is]: null,
        },
      });
    }
    const count = await this.menuRepository.count(options);
    options.attributes = [
      'id',
      'title',
      'url',
      'icon',
      'className',
      'parentMenuId',
      'order',
      'createdAt',
      'updatedAt',
    ];
    options.include = [
      {
        model: Menu,
        as: 'subMenus',
        required: false,
      },
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
          'parentMenuId',
          'order',
          'createdAt',
          'updatedAt',
        ],
        where: {
          [Op.and]: [
            {
              id,
            },
            {
              visibility: {
                [Op.is]: null,
              },
            },
          ],
        },
      }),
    };
  }

  async create(dto: MenuDto) {
    const menuObj = JSON.parse(JSON.stringify(dto));
    let menu = await this.menuRepository.create(menuObj);

    menu = await this.menuRepository.findOne({
      include: [
        {
          model: Menu,
          as: 'subMenus',
          required: false,
        },
      ],
      attributes: [
        'id',
        'title',
        'url',
        'icon',
        'className',
        'parentMenuId',
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
      include: [
        {
          model: Menu,
          as: 'subMenus',
          required: false,
        },
      ],
      where: {
        id: menuId,
        visibility: {
          [Op.is]: null,
        },
      },
    });
    if (!menu) throw new NotFoundException('Not Found!');

    await this.menuRepository.update(JSON.parse(JSON.stringify(dto)), {
      where: {
        id: menuId,
      },
    });

    menu = await this.menuRepository.findOne({
      include: [
        {
          model: Menu,
          as: 'subMenus',
          required: false,
        },
      ],
      attributes: [
        'id',
        'title',
        'url',
        'icon',
        'className',
        'parentMenuId',
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
