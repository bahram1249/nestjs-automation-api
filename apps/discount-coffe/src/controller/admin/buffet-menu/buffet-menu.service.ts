import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuffetMenu } from '@rahino/database/models/discount-coffe/buffet-menu.entity';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';

@Injectable()
export class BuffetMenuService {
  constructor(
    @InjectModel(BuffetMenu)
    private readonly repository: typeof BuffetMenu,
    @InjectModel(BuffetMenuCategory)
    private readonly buffetMenuCategoryRepository: typeof BuffetMenuCategory,
  ) {}

  async create() {
    const buffetMenuCategories =
      await this.buffetMenuCategoryRepository.findAll();

    return {
      title: 'ایجاد منو و کافه رستوران',
      layout: false,
      buffetMenuCategories: JSON.parse(JSON.stringify(buffetMenuCategories)),
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
      buffetMenu: buffetMenu.toJSON(),
    };
  }
}
