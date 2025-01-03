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
import { HolidayService } from './holiday.service';
import { Request } from 'express';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/holidays',
})
export class HolidayController {
  constructor(private service: HolidayService) {}
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.holidays.showmenu',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/holiday/index')
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'اعلام روز های تعطیل',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }

  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.holidays.showmenu',
  })
  @Get('/create')
  @HttpCode(HttpStatus.OK)
  @Render('admin/holiday/create')
  async create() {
    return await this.service.create();
  }
}
