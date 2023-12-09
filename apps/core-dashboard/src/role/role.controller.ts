import {
  Body,
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
import { RoleService } from './role.service';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/core/admin/roles',
})
export class RoleController {
  constructor(private service: RoleService) {}
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

  @CheckPermission({ permissionSymbol: 'core.admin.roles.showmenu' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @Render('roles/edit')
  async edit(@Param('id') roleId: number) {
    return await this.service.edit(roleId);
  }
}
