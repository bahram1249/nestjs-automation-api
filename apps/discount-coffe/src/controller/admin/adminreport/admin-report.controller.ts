import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Render,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JwtWebGuard } from '@rahino/auth';
import { GetUser } from '@rahino/auth';
import { Menu } from '@rahino/database';
import { AdminReportService } from './admin-report.service';
import { Request } from 'express';

@UseGuards(JwtWebGuard, PermissionGuard)
@Controller({
  path: '/discountcoffe/admin/adminreports',
})
export class AdminReportController {
  constructor(private service: AdminReportService) {}
  @CheckPermission({
    permissionSymbol: 'discountcoffe.admin.adminreports.getall',
  })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  @Render('admin/adminreport/index')
  async get(@GetUser('menus') menus: Menu[], @Req() req: Request) {
    return {
      title: 'گزارش های ادمین',
      menus: JSON.parse(JSON.stringify(menus)),
      sitename: req.sitename,
    };
  }
}
