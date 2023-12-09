import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Param,
  Post,
  Put,
  Query,
  Render,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard, JwtWebGuard } from '@rahino/auth/guard';

//@UseGuards(JwtGuard, PermissionGuard)
@UseGuards(JwtWebGuard)
@Controller({
  path: '/core/dashboard/role',
})
export class RoleController {
  constructor() {}
  //@CheckPermission({ permissionSymbol: 'core.admin.roles.showmenu' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('roles/index')
  async get() {
    return { title: '' };
  }
}
