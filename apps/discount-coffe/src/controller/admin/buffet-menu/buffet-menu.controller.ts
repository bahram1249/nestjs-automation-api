import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JwtWebGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';
import { Menu } from '@rahino/database';
import { BuffetMenuService } from './buffet-menu.service';
import { Request } from 'express';

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
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'منو کافه و رستوران',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
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
