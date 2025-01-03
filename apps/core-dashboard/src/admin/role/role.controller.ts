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
import { RoleService } from './role.service';
import { Request } from 'express';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/core/admin/roles',
})
export class RoleController {
  constructor(private service: RoleService) {}
  @CheckPermission({ permissionSymbol: 'core.admin.roles.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('roles/index')
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'گروه های کاربری',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }

  @CheckPermission({ permissionSymbol: 'core.admin.roles.create' })
  @Get('/create')
  @HttpCode(HttpStatus.OK)
  @Render('roles/create')
  async create() {
    return await this.service.create();
  }

  @CheckPermission({ permissionSymbol: 'core.admin.roles.update' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Render('roles/edit')
  async edit(@Param('id') roleId: number) {
    return await this.service.edit(roleId);
  }
}
