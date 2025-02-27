import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuffetMenu } from '@rahino/localdatabase/models';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';
import { Buffet } from '@rahino/localdatabase/models';

@Injectable()
export class BuffetMenuService {
  constructor(
    @InjectModel(BuffetMenu)
    private readonly repository: typeof BuffetMenu,
    @InjectModel(BuffetMenuCategory)
    private readonly buffetMenuCategoryRepository: typeof BuffetMenuCategory,
    @InjectModel(Buffet)
    private readonly buffetRepository: typeof Buffet,
  ) {}

  async create(buffetId: bigint) {
    const buffetMenuCategories =
      await this.buffetMenuCategoryRepository.findAll();

    const buffet = await this.buffetRepository.findOne({
      where: {
        id: buffetId,
      },
    });
    if (!buffet) throw new NotFoundException();

    return {
      title: 'ایجاد منو و کافه رستوران',
      layout: false,
      buffetMenuCategories: JSON.parse(JSON.stringify(buffetMenuCategories)),
      buffet: buffet.toJSON(),
    };
  }

  async edit(buffetMenuId: bigint) {
    const buffetMenuCategories =
      await this.buffetMenuCategoryRepository.findAll();
    const buffetMenu = await this.repository.findOne({
      where: {
        id: buffetMenuId,
      },
    });
    if (!buffetMenu) throw new NotFoundException();

    return {
      title: 'ویرایش ' + buffetMenu.title,
      layout: false,
      buffetMenuCategories: JSON.parse(JSON.stringify(buffetMenuCategories)),
      menu: buffetMenu.toJSON(),
    };
  }
}
