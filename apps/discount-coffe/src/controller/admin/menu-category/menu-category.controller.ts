import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Render,
  UseGuards,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JwtWebGuard } from '@rahino/auth/guard';
import { GetUser } from '@rahino/auth/decorator';
import { Menu } from '@rahino/database/models/core/menu.entity';
import { MenuCategoryService } from './menu-category.service';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/menucategories',
})
export class MenuCategoryController {
  constructor(private service: MenuCategoryService) {}
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.menucategories.getall',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/menucategory/index')
  async get(@GetUser('menus') menus: Menu[]) {
    return {
      title: 'دسته بندی منو ها',
      menus: JSON.parse(JSON.stringify(menus)),
    };
  }

  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.menucategories.create',
  })
  @Get('/create')
  @HttpCode(HttpStatus.OK)
  @Render('admin/menucategory/create')
  async create() {
    return await this.service.create();
  }

  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.menucategories.update',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Render('admin/menucategory/edit')
  async edit(@Param('id') menuCategoryId: number) {
    return await this.service.edit(menuCategoryId);
  }
}
