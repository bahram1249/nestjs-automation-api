import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuffetMenuCategory } from '@rahino/database/models/discount-coffe/buffet-menu-category.entity';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectModel(BuffetMenuCategory)
    private readonly repository: typeof BuffetMenuCategory,
  ) {}

  async create() {
    return {
      title: 'ایجاد دسته بندی منو',
      layout: false,
    };
  }

  async edit(menuId: bigint) {
    const buffetMenuCategory = await this.repository.findOne({
      where: {
        id: menuId,
      },
    });
    if (!buffetMenuCategory) throw new NotFoundException();
    return {
      title: 'ویرایش ' + buffetMenuCategory.title,
      layout: false,
      buffetMenuCategory: buffetMenuCategory.toJSON(),
      //roles: JSON.parse(JSON.stringify(roles)),
    };
  }
}
