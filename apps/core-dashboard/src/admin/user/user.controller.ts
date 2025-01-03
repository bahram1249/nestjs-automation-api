import {
  Body,
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
import { UserService } from './user.service';
import { Request } from 'express';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/core/admin/users',
})
export class UserController {
  constructor(private service: UserService) {}
  @CheckPermission({ permissionSymbol: 'core.admin.users.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('users/index')
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'کاربران',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }

  @CheckPermission({ permissionSymbol: 'core.admin.users.create' })
  @Get('/create')
  @HttpCode(HttpStatus.OK)
  @Render('users/create')
  async create() {
    return await this.service.create();
  }

  @CheckPermission({ permissionSymbol: 'core.admin.users.update' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Render('users/edit')
  async edit(@Param('id') roleId: number) {
    return await this.service.edit(roleId);
  }
}
