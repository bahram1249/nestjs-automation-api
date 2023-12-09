import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Render,
  UseGuards,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JwtWebGuard } from '@rahino/auth/guard';
import { GetUser } from '@rahino/auth/decorator';
import { Menu } from '@rahino/database/models/core/menu.entity';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/core/admin/roles',
})
export class RoleController {
  constructor() {}
  @CheckPermission({ permissionSymbol: 'core.admin.roles.showmenu' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('roles/index')
  async get(@GetUser('menus') menus: Menu[]) {
    return {
      title: 'گروه های کاربری',
      menus: JSON.parse(JSON.stringify(menus)),
    };
  }
}
