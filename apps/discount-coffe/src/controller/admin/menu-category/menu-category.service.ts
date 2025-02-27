import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BuffetMenuCategory } from '@rahino/localdatabase/models';

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

  async edit(menuCategoryId: number) {
    const buffetMenuCategory = await this.repository.findOne({
      where: {
        id: menuCategoryId,
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
