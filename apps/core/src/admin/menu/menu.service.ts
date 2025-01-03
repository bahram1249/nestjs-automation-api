import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Menu } from '@rahino/database';
import { Op, Sequelize } from 'sequelize';
import { GetMenuDto, MenuDto } from './dto';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';

@Injectable()
export class MenuService {
  constructor(
    @InjectModel(Menu)
    private readonly menuRepository: typeof Menu,
  ) {}

  async findAll(filter: GetMenuDto) {
    let builder = new QueryOptionsBuilder();
    builder = builder
      .filter({
        title: {
          [Op.like]: filter.search,
        },
      })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('visibility'), 1),
          {
            [Op.eq]: 1,
          },
        ),
      );

    if (filter.onlyParent == true) {
      builder = builder.filter({
        parentMenuId: {
          [Op.is]: null,
        },
      });
    }
    let options = builder.build();
    const count = await this.menuRepository.count(options);
    options = builder
      .attributes([
        'id',
        'title',
        'url',
        'icon',
        'className',
        'parentMenuId',
        'order',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: Menu,
          as: 'subMenus',
          required: false,
        },
      ])
      .limit(filter.limit)
      .offset(filter.offset)
      .order({ orderBy: filter.orderBy, sortOrder: filter.sortOrder })
      .build();

    return {
      result: await this.menuRepository.findAll(options),
      total: count,
    };
  }

  async findById(id: number) {
    const builder = new QueryOptionsBuilder();
    const options = builder
      .attributes([
        'id',
        'title',
        'url',
        'icon',
        'className',
        'parentMenuId',
        'order',
        'createdAt',
        'updatedAt',
      ])
      .filter({ id })
      .filter(
        Sequelize.where(
          Sequelize.fn('isnull', Sequelize.col('visibility'), 1),
          {
            [Op.eq]: 1,
          },
        ),
      )
      .build();
    return {
      result: await this.menuRepository.findOne(options),
    };
  }

  async create(dto: MenuDto) {
    const menuObj = JSON.parse(JSON.stringify(dto));
    let menu = await this.menuRepository.create(menuObj);
    const builder = new QueryOptionsBuilder();
    const options = builder
      .include({
        model: Menu,
        as: 'subMenus',
        required: false,
      })
      .attributes([
        'id',
        'title',
        'url',
        'icon',
        'className',
        'parentMenuId',
        'order',
        'createdAt',
        'updatedAt',
      ])
      .filter({ id: menu.id })
      .build();
    menu = await this.menuRepository.findOne(options);
    return {
      result: menu,
    };
  }

  async update(menuId: number, dto: MenuDto) {
    // logic validation
    let builder = new QueryOptionsBuilder();
    let options = builder
      .include([
        {
          model: Menu,
          as: 'subMenus',
          required: false,
        },
      ])
      .filter({
        id: menuId,
        visibility: {
          [Op.is]: null,
        },
      })
      .build();
    let menu = await this.menuRepository.findOne(options);
    if (!menu) throw new NotFoundException('Not Found!');

    await this.menuRepository.update(JSON.parse(JSON.stringify(dto)), {
      where: {
        id: menuId,
      },
    });
    builder = new QueryOptionsBuilder();
    options = builder
      .attributes([
        'id',
        'title',
        'url',
        'icon',
        'className',
        'parentMenuId',
        'order',
        'createdAt',
        'updatedAt',
      ])
      .include([
        {
          model: Menu,
          as: 'subMenus',
          required: false,
        },
      ])
      .filter({ id: menuId })
      .build();
    menu = await this.menuRepository.findOne(options);
    return {
      result: menu,
    };
  }
}
