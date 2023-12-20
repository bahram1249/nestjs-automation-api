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
import { BuffetMenuService } from './buffet-menu.service';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/menus',
})
export class BuffetMenuController {
  constructor(private service: BuffetMenuService) {}
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.menus.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/menus/index')
  async get(@GetUser('menus') menus: Menu[]) {
    return {
      title: 'منو کافه و رستوران',
      menus: JSON.parse(JSON.stringify(menus)),
    };
  }

  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.menus.create' })
  @Get('/create/:buffetId')
  @HttpCode(HttpStatus.OK)
  @Render('admin/menus/create')
  async create(@Param('buffetId') buffetId: bigint) {
    return await this.service.create(buffetId);
  }

  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.menus.update' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Render('admin/menus/edit')
  async edit(@Param('id') buffetMenuId: bigint) {
    return await this.service.edit(buffetMenuId);
  }
}
