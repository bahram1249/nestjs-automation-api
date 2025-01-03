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
import { BuffetService } from './buffet.service';
import { Request } from 'express';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/buffets',
})
export class BuffetController {
  constructor(private service: BuffetService) {}
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/buffets/index')
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'کافه و رستوران',
      sitename: req.sitename,
      menus: JSON.parse(JSON.stringify(menus)),
    };
  }

  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.create' })
  @Get('/create')
  @HttpCode(HttpStatus.OK)
  @Render('admin/buffets/create')
  async create() {
    return await this.service.create();
  }

  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.update' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Render('admin/buffets/edit')
  async edit(@Param('id') buffetId: bigint) {
    return await this.service.edit(buffetId);
  }

  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.menu' })
  @Get('/menus/:id')
  @HttpCode(HttpStatus.OK)
  @Render('admin/buffets/menus')
  async menu(@Param('id') buffetId: bigint) {
    return await this.service.menus(buffetId);
  }
}
